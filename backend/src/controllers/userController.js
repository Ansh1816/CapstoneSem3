const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                email: true, // Maybe hide this for public profiles?
                createdAt: true,
                gems: {
                    include: {
                        reviews: { select: { rating: true } }
                    }
                },
                savedGems: {
                    include: {
                        gem: {
                            include: {
                                reviews: { select: { rating: true } }
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Process gems to add average rating
        const processGems = (gems) => gems.map(gem => {
            const reviewCount = gem.reviews.length;
            const totalRating = gem.reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
            const { reviews, ...gemData } = gem;
            return { ...gemData, reviewCount, averageRating };
        });

        const submittedGems = processGems(user.gems);
        const savedGems = processGems(user.savedGems.map(sg => sg.gem));

        res.json({
            user: {
                id: user.id,
                name: user.name,
                joinedAt: user.createdAt,
            },
            submittedGems,
            savedGems
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
