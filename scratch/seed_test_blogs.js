const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    let user = await prisma.user.findFirst();
    let cat = await prisma.category.findFirst();
    if (!cat || !user) return;

    const postsData = [
        {
            title: "Google Maps Formulas for Google Sheets",
            shortDescription: "Master spreadsheet automation with geolocation",
            slug: "google-maps-formulas",
            excerpt: "Use Google Maps formulas inside Google Sheets to calculate distances, travel time, get driving directions, look up postal codes with reverse geocoding and more!",
            content: "Full content here..."
        },
        {
            title: "How to Link Postal Addresses to Google Maps in Google Sheets",
            shortDescription: "Make your addresses interactive and clickable",
            slug: "link-postal-addresses",
            excerpt: "Learn how to make postal addresses clickable in Google Sheets with a formula. Create hyperlinks that directly link an addres to Google Maps places.",
            content: "Full content here..."
        },
        {
            title: "How to Embed Google Maps in your Website Responsively and Lazily",
            shortDescription: "Improve site performance with lazy loading maps",
            slug: "embed-google-maps",
            excerpt: "How to embed Google Maps to your website in a responsive manner with lazy loading. The maps will resize based on the device screen and load only when the user scrolls to the map thus making the page load faster.",
            content: "Full content here..."
        },
        {
            title: "Find Public Restrooms Near Your Current Location",
            shortDescription: "A practical guide for urban explorers",
            slug: "find-public-restrooms",
            excerpt: "Use Google Maps to find public toilets near your current location. All you need to do is type a search query in the search box.",
            content: "Full content here..."
        }
    ];

    for (const post of postsData) {
        await prisma.post.upsert({
            where: { slug: post.slug },
            update: {
                showOnHome: true,
                published: true,
                shortDescription: post.shortDescription
            },
            create: {
                ...post,
                categoryId: cat.id,
                authorId: user.id,
                published: true,
                showOnHome: true
            }
        });
    }

    console.log("Seeding successful with short descriptions!");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
