const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.post.deleteMany({
      where: {
        slug: {
          in: [
            'google-maps-formulas',
            'link-postal-addresses',
            'embed-google-maps',
            'find-public-restrooms'
          ]
        }
      }
    });
    console.log(`Deleted ${res.count} dummy blogs.`);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
