const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const axios = require('axios');

exports.createGem = async (req, res) => {
    try {
        const { title, description, category, latitude, longitude, images, location } = req.body;
        const userId = req.userId;

        // ML Moderation removed as per request
        const verified = false;

        const gem = await prisma.gem.create({
            data: {
                title,
                description,
                category: category || 'Other',
                latitude,
                longitude,
                images: JSON.stringify(images), // Store as JSON string
                location,
                userId,
                verified,
            },
        });

        res.status(201).json(gem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Helper: Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

// Helper: Geocode city name
async function getCoordinates(city) {
    try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
            params: {
                q: city,
                format: 'json',
                limit: 1
            },
            headers: {
                'User-Agent': 'HiddenGemsApp/1.0' // Nominatim requires a User-Agent
            }
        });
        if (response.data && response.data.length > 0) {
            return {
                lat: parseFloat(response.data[0].lat),
                lon: parseFloat(response.data[0].lon),
                displayName: response.data[0].display_name
            };
        }
        return null;
    } catch (error) {
        console.error('Geocoding error:', error.message);
        return null;
    }
}

exports.getGems = async (req, res) => {
    try {
        const { search, sort, page = 1, limit = 10, city, category } = req.query;

        let where = {};
        const conditions = [];

        if (search) {
            conditions.push({
                OR: [
                    { title: { contains: search } },
                    { description: { contains: search } },
                ],
            });
        }

        if (category && category !== 'All') {
            conditions.push({ category: category });
        }

        if (conditions.length > 0) {
            where = { AND: conditions };
        }

        // Fetch gems with reviews and votes
        const gemsRaw = await prisma.gem.findMany({
            where,
            include: {
                user: {
                    select: { name: true },
                },
                reviews: {
                    select: { rating: true },
                },
                votes: true,
            },
        });

        let targetCoords = null;
        if (req.query.userLat && req.query.userLng) {
            targetCoords = {
                lat: parseFloat(req.query.userLat),
                lon: parseFloat(req.query.userLng)
            };
        } else if (city) {
            targetCoords = await getCoordinates(city);
        }

        // Process gems to add stats and distance
        let gems = gemsRaw.map(gem => {
            const reviewCount = gem.reviews.length;
            const totalRating = gem.reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;

            const upvotes = gem.votes.filter(v => v.type === 'UP').length;
            const downvotes = gem.votes.filter(v => v.type === 'DOWN').length;
            const score = upvotes - downvotes;

            let distance = null;
            if (targetCoords) {
                distance = calculateDistance(
                    targetCoords.lat,
                    targetCoords.lon,
                    gem.latitude,
                    gem.longitude
                );
            }

            // Remove reviews/votes array to keep response clean
            const { reviews, votes, ...gemData } = gem;
            return { ...gemData, reviewCount, averageRating, distance, upvotes, downvotes, score };
        });

        // Filter by distance if city was provided
        if (targetCoords) {
            gems = gems.filter(gem => gem.distance !== null && gem.distance <= 50);
            if (!sort || sort === 'distance') {
                gems.sort((a, b) => a.distance - b.distance);
            }
        }

        // Sort in memory
        if (sort === 'newest') {
            gems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sort === 'oldest') {
            gems.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sort === 'title') {
            gems.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === 'rating') {
            gems.sort((a, b) => b.averageRating - a.averageRating);
        } else if (sort === 'popularity') {
            gems.sort((a, b) => b.score - a.score); // Sort by vote score
        } else if (sort === 'distance' && targetCoords) {
            gems.sort((a, b) => a.distance - b.distance);
        } else if (!targetCoords && !sort) {
            gems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // Pagination
        const total = gems.length;
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        const paginatedGems = gems.slice(startIndex, endIndex);

        res.json({
            gems: paginatedGems,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            cityCenter: targetCoords
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateGem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, latitude, longitude, images, location } = req.body;
        const userId = req.userId;

        const gem = await prisma.gem.findUnique({ where: { id: parseInt(id) } });

        if (!gem) {
            return res.status(404).json({ message: 'Gem not found' });
        }

        if (gem.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedGem = await prisma.gem.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                category: category || gem.category,
                latitude,
                longitude,
                images: images ? JSON.stringify(images) : gem.images,
                location,
            },
        });

        res.json(updatedGem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteGem = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const gem = await prisma.gem.findUnique({ where: { id: parseInt(id) } });

        if (!gem) {
            return res.status(404).json({ message: 'Gem not found' });
        }

        if (gem.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await prisma.gem.delete({ where: { id: parseInt(id) } });

        res.json({ message: 'Gem deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getGemById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId; // Optional, might be null if not logged in

        const gem = await prisma.gem.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: { name: true },
                },
                reviews: {
                    include: {
                        user: {
                            select: { name: true },
                        },
                    },
                },
                votes: true,
                savedBy: true,
            },
        });

        if (!gem) {
            return res.status(404).json({ message: 'Gem not found' });
        }

        const upvotes = gem.votes.filter(v => v.type === 'UP').length;
        const downvotes = gem.votes.filter(v => v.type === 'DOWN').length;

        let userVote = null;
        let isSaved = false;

        if (userId) {
            const vote = gem.votes.find(v => v.userId === userId);
            if (vote) userVote = vote.type;

            const saved = gem.savedBy.find(s => s.userId === userId);
            if (saved) isSaved = true;
        }

        // Clean up response
        const { votes, savedBy, ...gemData } = gem;

        res.json({ ...gemData, upvotes, downvotes, userVote, isSaved });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.voteGem = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body; // 'UP' or 'DOWN'
        const userId = req.userId;

        if (!['UP', 'DOWN'].includes(type)) {
            return res.status(400).json({ message: 'Invalid vote type' });
        }

        // Upsert vote
        const vote = await prisma.vote.upsert({
            where: {
                userId_gemId: {
                    userId,
                    gemId: parseInt(id),
                },
            },
            update: {
                type,
            },
            create: {
                userId,
                gemId: parseInt(id),
                type,
            },
        });

        res.json(vote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.saveGem = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        await prisma.savedGem.create({
            data: {
                userId,
                gemId: parseInt(id),
            },
        });

        res.json({ message: 'Gem saved' });
    } catch (error) {
        // Ignore unique constraint error (already saved)
        if (error.code === 'P2002') {
            return res.json({ message: 'Gem already saved' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.unsaveGem = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        await prisma.savedGem.delete({
            where: {
                userId_gemId: {
                    userId,
                    gemId: parseInt(id),
                },
            },
        });

        res.json({ message: 'Gem unsaved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
