import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    });

    return result;
};

const getAllPosts = async (payload: Record<string, any>) => {
    const where: any = {};

    if (payload.search) {
        where.OR = [
            { title: { contains: payload.search, mode: 'insensitive' } },
            { content: { contains: payload.search, mode: 'insensitive' } },
            { tags: { has: payload.search } },
        ];
    };

    if (payload.tags && payload.tags.length > 0) {
        where.tags = {
            hasEvery: payload.tags as string[],
        };
    };

    const posts = await prisma.post.findMany({
        where: where
        // {
        //     OR: [
        //         {
        //             title: {
        //                 contains: payload.search,
        //                 mode: 'insensitive'
        //             }
        //         },
        //         {
        //             content: {
        //                 contains: payload.search,
        //                 mode: 'insensitive'
        //             }
        //         },
        //         {
        //             tags: {
        //                 has: payload.search
        //             }
        //         }
        //     ],
        //     tags: {
        //         hasEvery: payload.tags as string[]
        //     }
        // }
    });
    return posts;
}

export const postService = {
    createPost,
    getAllPosts,
};