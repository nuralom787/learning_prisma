import app from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT || 5000;

async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");


        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (err) {
        console.error("Failed to connect to the database:", err);
        prisma.$disconnect();
        process.exit(1);
    }
};


main();