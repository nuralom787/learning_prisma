import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// ! Create New Posts.
const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    });

    return result;
};


// ! Get All Posts with Filters.
const getAllPosts = async (payload: Record<string, any>) => {
    const where: any = {};

    if (payload.search) {
        where.OR = [
            { title: { contains: payload.search, mode: 'insensitive' } },
            { content: { contains: payload.search, mode: 'insensitive' } },
            { tags: { has: payload.search } },
        ];
    };

    if (payload.isFeatured) {
        where.isFeatured = payload.isFeatured === 'true';
    };

    if (payload.status) {
        where.status = payload.status.toUpperCase();
    };

    if (payload.authorId) {
        where.authorId = { equals: payload.authorId, mode: 'insensitive' };
    };

    if (payload.tags && payload.tags.length > 0) {
        where.tags = {
            hasEvery: payload.tags as string[],
        };
    };

    const posts = await prisma.post.findMany({
        where: where,
        skip: payload.skip,
        take: payload.take,
        orderBy: payload.orderBy ? { createdAt: payload.orderBy } : {},
        include: {
            _count: { select: { comments: true } },
        },
    });

    const totalPosts = await prisma.post.count({ where });

    return { posts, totalPosts };
};


// ! Get Single Post by ID.
const getSinglePost = async (postId: string) => {
    // const post = await prisma.post.findUnique({
    //     where: { id: postId },
    // });

    // if (!post) {
    //     throw new Error('Post not found');
    // };

    // const updateViewCount = await prisma.post.update({
    //     where: { id: postId },
    //     data: { views: { increment: 1 } },
    // });

    // if (updateViewCount) {
    //     return post;
    // } else {
    //     throw new Error('Failed to update view count');
    // };

    // ! Optimized Single Post Retrieval with $transaction Method.
    const results = await prisma.$transaction(async (tx) => {
        const updateViewCount = await tx.post.update({
            where: { id: postId },
            data: { views: { increment: 1 } },
        });

        if (updateViewCount) {
            const post = await tx.post.findUnique({
                where: { id: postId },
                include: {
                    comments: {
                        where: { parentId: null },
                        orderBy: { createdAt: 'desc' },
                        include: {
                            replies: true,
                        },
                    },
                    _count: { select: { comments: true } },
                }
            });

            if (!post) {
                return { success: false, message: 'No post found by given ID' };
            };
            return post;
        }
        else {
            throw new Error();
        };
    });
    return results;
};


// ! Get All Posts by User ID.
const getAllPostsByUser = async (userId: string) => {
    const posts = await prisma.post.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
    });
    return posts;
};


export const postService = {
    createPost,
    getAllPosts,
    getSinglePost,
    getAllPostsByUser,
};