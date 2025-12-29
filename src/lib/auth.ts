import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

import nodemailer from "nodemailer";

// const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const auth = betterAuth({
    trustedOrigins: [process.env.APP_URL || "http://localhost:5000"],
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
                required: false,
                input: false
            },
            phone: {
                type: "string",
                required: false,
                input: true
            },
            status: {
                type: "string",
                defaultValue: "active",
                required: false,
            }
        }
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {

            const verificationURL = `${process.env.APP_URL}/verify-email?token=${token}`;

            const info = await transporter.sendMail({
                from: '"Learn Prisma" <alamn7150@gmail.com>',
                to: "md9577630@gmail.com",
                subject: "Verify your email address",
                text: `Click the link to verify your email: ${url}`,
            });

            console.log("Verification Email Sent!!");
        },
    }
});