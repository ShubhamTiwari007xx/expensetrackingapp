const { prisma } = require("../db.js");
async function test() {
    try {
        await prisma.user.create({ data: { name: 'test' } });
    } catch (e) {
        console.log(e.message);
    }
    process.exit(0);
}
test();
