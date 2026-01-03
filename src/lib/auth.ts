import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

import nodemailer from "nodemailer";

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
    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
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
        sendOnSignUp: true,
        autoSignInAfterVerification: false,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationURL = `${process.env.APP_URL}/verify-email?token=${token}`;

                const info = await transporter.sendMail({
                    from: '"Learn Prisma" <alamn7150@gmail.com>',
                    to: user.email!,
                    subject: "Verify your email address",
                    text: `Click the link to verify your email: ${url}`,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                          <meta charset="utf-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <title>Verify Your Email</title>
                          <style>
                            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f7; color: #333; margin: 0; padding: 0; }
                            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                            .header { background-color: #4F46E5; padding: 30px; text-align: center; color: white; }
                            .content { padding: 40px; text-align: center; line-height: 1.6; }
                            .button { display: inline-block; padding: 14px 30px; background-color: #4F46E5; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 25px; }
                            .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
                          </style>
                        </head>
                        <body>
                          <div class="container">
                            <div class="header">
                              <h1>Learn Prisma</h1>
                            </div>
                            <div class="content">
                              <h2>আপনার ইমেইল ভেরিফাই করুন</h2>
                              <h3>হ্যালো ${user.name},</h3>
                              <p>আমাদের প্ল্যাটফর্মে যোগ দেওয়ার জন্য ধন্যবাদ! আপনার অ্যাকাউন্টটি সচল করতে নিচের বাটনে ক্লিক করে ইমেইলটি ভেরিফাই করুন।</p>
                              <a href="${verificationURL}" class="button">Email ভেরিফাই করুন</a>
                              <p style="margin-top: 25px; font-size: 14px; color: #9ca3af;">
                                বাটনটি কাজ না করলে নিচের লিঙ্কটি কপি করে ব্রাউজারে পেস্ট করুন:<br>
                                <a href="${verificationURL}" style="color: #4F46E5;">${verificationURL}</a>
                              </p>
                            </div>
                            <div class="footer">
                              <p>&copy; ${new Date().getFullYear()} Learn Prisma. All rights reserved.</p>
                            </div>
                          </div>
                        </body>
                        </html>
                        `,
                });

                // console.log("Verification Email Sent!!", info.response);
            }
            catch (error) {
                console.error("Error sending verification email:", error);
            }
        },
    }
});