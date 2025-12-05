const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
    console.log('Start seeding ...');

    // Clear existing data
    await prisma.review.deleteMany({});
    await prisma.vote.deleteMany({});
    await prisma.gem.deleteMany({});

    // Create Users
    const password = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.upsert({
        where: { email: 'alice@example.com' },
        update: {},
        create: {
            email: 'alice@example.com',
            name: 'Alice Explorer',
            password,
        },
    });

    const user2 = await prisma.user.upsert({
        where: { email: 'bob@example.com' },
        update: {},
        create: {
            email: 'bob@example.com',
            name: 'Bob Traveler',
            password,
        },
    });

    // Gems Data
    const gemsData = [
        {
            title: 'Central Park Secret Spot',
            description: 'A quiet bench near the lake, perfect for reading.',
            latitude: 40.785091,
            longitude: -73.968285,
            location: 'New York',
            images: JSON.stringify(['https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80']),
            userId: user1.id,
        },
        {
            title: 'High Line Hidden Garden',
            description: 'A beautiful small garden section on the High Line.',
            latitude: 40.7484,
            longitude: -74.0048,
            location: 'New York',
            images: JSON.stringify(['https://images.unsplash.com/photo-1534234828563-02511c75626d?auto=format&fit=crop&w=800&q=80']),
            userId: user2.id,
        },
        {
            title: 'Little Venice',
            description: 'A scenic canal area in London, feels like Italy.',
            latitude: 51.5228,
            longitude: -0.1817,
            location: 'London',
            images: JSON.stringify(['https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&w=800&q=80']),
            userId: user1.id,
        },
        {
            title: 'Kyoto Garden',
            description: 'A peaceful Japanese garden in Holland Park.',
            latitude: 51.5020,
            longitude: -0.2045,
            location: 'London',
            images: JSON.stringify(['https://images.unsplash.com/photo-1599159556272-4c275525585d?auto=format&fit=crop&w=800&q=80']),
            userId: user2.id,
        },
        {
            title: 'Montmartre Vineyard',
            description: 'A secret vineyard in the heart of Paris.',
            latitude: 48.8878,
            longitude: 2.3405,
            location: 'Paris',
            images: JSON.stringify(['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80']),
            userId: user1.id,
        },
        {
            title: 'Omoide Yokocho',
            description: 'Memory Lane, a narrow alley with small food stalls.',
            latitude: 35.6930,
            longitude: 139.6994,
            location: 'Tokyo',
            images: JSON.stringify(['https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80']),
            userId: user2.id,
        },
        {
            title: 'Lodhi Art District',
            description: 'Open air art museum with beautiful murals.',
            latitude: 28.5893,
            longitude: 77.2226,
            location: 'Delhi',
            images: JSON.stringify(['https://images.unsplash.com/photo-1587474262715-9aa032fa4a8b?auto=format&fit=crop&w=800&q=80']),
            userId: user1.id,
        },
        {
            title: 'Beatles Ashram',
            description: 'The abandoned ashram where The Beatles stayed in 1968. Full of graffiti and history.',
            latitude: 30.1065,
            longitude: 78.3032,
            location: 'Rishikesh',
            images: JSON.stringify(['https://images.unsplash.com/photo-1626125345510-4603468ee534?auto=format&fit=crop&w=800&q=80']),
            userId: user2.id,
        },
        {
            title: 'Triveni Ghat',
            description: 'A sacred ghat on the Ganges, famous for the evening Ganga Aarti.',
            latitude: 30.1060,
            longitude: 78.2950,
            location: 'Rishikesh',
            images: JSON.stringify(['https://images.unsplash.com/photo-1596021688656-35fdc9ed0274?auto=format&fit=crop&w=800&q=80']),
            userId: user1.id,
        },
        {
            title: 'Neer Garh Waterfall',
            description: 'A beautiful waterfall accessible by a short trek.',
            latitude: 30.1420,
            longitude: 78.3280,
            location: 'Rishikesh',
            images: JSON.stringify(['https://images.unsplash.com/photo-1624821588855-a5ff39765b90?auto=format&fit=crop&w=800&q=80']),
            userId: user2.id,
        },
        {
            title: 'Patna Waterfall',
            description: 'A hidden waterfall near the Patna village, less crowded.',
            latitude: 30.0950,
            longitude: 78.3450,
            location: 'Rishikesh',
            images: JSON.stringify(['https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80']),
            userId: user1.id,
        },
        {
            title: 'Hadimba Devi Temple',
            description: 'An ancient cave temple dedicated to Hidimbi Devi, surrounded by a cedar forest.',
            latitude: 32.2483,
            longitude: 77.1807,
            location: 'Manali',
            images: JSON.stringify(['https://images.unsplash.com/photo-1588953683179-6635df025796?auto=format&fit=crop&w=800&q=80']),
            userId: user1.id,
        },
        {
            title: 'Jogini Waterfalls',
            description: 'A stunning waterfall with a scenic trek from Vashisht village.',
            latitude: 32.2616,
            longitude: 77.1924,
            location: 'Manali',
            images: JSON.stringify(['https://images.unsplash.com/photo-1626621341476-3b375f690c97?auto=format&fit=crop&w=800&q=80']),
            userId: user2.id,
        },
        {
            title: 'Solang Valley',
            description: 'Famous for its stunning views and adventure sports like paragliding.',
            latitude: 32.3166,
            longitude: 77.1576,
            location: 'Manali',
            images: JSON.stringify(['https://images.unsplash.com/photo-1562649846-ab413ca01712?auto=format&fit=crop&w=800&q=80']),
            userId: user1.id,
        },
        {
            title: 'Tsuglagkhang Complex',
            description: 'The official residence of the Dalai Lama, a peaceful spiritual center.',
            latitude: 32.2330,
            longitude: 76.3245,
            location: 'Dharamshala',
            images: JSON.stringify(['https://images.unsplash.com/photo-1579618218290-55a05f70d74b?auto=format&fit=crop&w=800&q=80']),
            userId: user2.id,
        },
        {
            title: 'Triund Hill',
            description: 'A popular trekking spot with panoramic views of the Dhauladhar range.',
            latitude: 32.2568,
            longitude: 76.3556,
            location: 'Dharamshala',
            images: JSON.stringify(['https://images.unsplash.com/photo-1593183568358-1599386663f3?auto=format&fit=crop&w=800&q=80']),
            userId: user1.id,
        },
        {
            title: 'Nahargarh Fort',
            description: 'Offers the best sunset views over the Pink City.',
            latitude: 26.9370,
            longitude: 75.8155,
            location: 'Jaipur',
            images: JSON.stringify(['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80']),
            userId: user2.id,
        },
        {
            title: 'Panna Meena ka Kund',
            description: 'A historic stepwell with symmetrical stairs, great for photography.',
            latitude: 26.9859,
            longitude: 75.8507,
            location: 'Jaipur',
            images: JSON.stringify(['https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=800&q=80']),
            userId: user1.id,
        },
        {
            title: 'Mehtab Bagh',
            description: 'A garden complex across the Yamuna River, offering a stunning view of the Taj Mahal.',
            latitude: 27.1800,
            longitude: 78.0421,
            location: 'Agra',
            images: JSON.stringify(['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80']),
            userId: user2.id,
        },
        {
            title: 'Kasol Bridge',
            description: 'A scenic bridge over the Parvati River, gateway to many treks.',
            latitude: 32.0100,
            longitude: 77.3150,
            location: 'Kasol',
            images: JSON.stringify(['https://images.unsplash.com/photo-1605649487215-476f06c252d2?auto=format&fit=crop&w=800&q=80']),
            userId: user1.id,
        },
        {
            title: 'Tosh Village',
            description: 'A quiet village at the end of the Parvati Valley, known for its views.',
            latitude: 32.0165,
            longitude: 77.4500,
            location: 'Kasol',
            images: JSON.stringify(['https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80']),
            userId: user2.id,
        },

    ];

    for (const gem of gemsData) {
        const createdGem = await prisma.gem.create({
            data: gem,
        });
        console.log(`Created gem with id: ${createdGem.id}`);

        // Add random reviews
        await prisma.review.create({
            data: {
                content: 'Amazing place! A true hidden gem.',
                rating: 5,
                userId: gem.userId === user1.id ? user2.id : user1.id,
                gemId: createdGem.id,
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
