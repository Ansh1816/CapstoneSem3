const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createReview = async (req, res) => {
    try {
        const { content, rating, gemId } = req.body;
        const userId = req.userId;

        const review = await prisma.review.create({
            data: {
                content,
                rating,
                gemId: parseInt(gemId),
                userId,
            },
        });

        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getReviewsByGemId = async (req, res) => {
    try {
        const { gemId } = req.params;
        const reviews = await prisma.review.findMany({
            where: { gemId: parseInt(gemId) },
            include: {
                user: {
                    select: { name: true },
                },
            },
        });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const review = await prisma.review.findUnique({ where: { id: parseInt(id) } });

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (review.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await prisma.review.delete({ where: { id: parseInt(id) } });

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
