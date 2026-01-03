import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/authMiddleware";

async function seedAdmin() {
    try {
        const adminUser = {
            name: "Md Nur Alom Islam",
            email: "admin1@admin.com",
            role: UserRole.ADMIN,
            password: "admin123"
        };

        // ! Check if admin user already exists
        const existingUser = await prisma.user.findUnique({ where: { email: adminUser.email } });

        if (existingUser) {
            throw new Error("User already exists");
        };

        const signedUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(adminUser)
        });

        // console.log("From Seed Admin: ", signedUpAdmin);

        if (!signedUpAdmin.ok) {
            const errorData = await signedUpAdmin.json();
            throw new Error(`Failed to create admin user: ${errorData.message}`);
        };

        if (signedUpAdmin.ok) {
            const updateUser = await prisma.user.update({
                where: { email: adminUser.email },
                data: { emailVerified: true, role: UserRole.ADMIN }
            });

            console.log("Admin user created successfully", updateUser);
        };

    }
    catch (err) {
        console.log(err);
    }
};

seedAdmin();