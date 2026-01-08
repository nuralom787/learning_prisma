import { Post, PostStatus } from "../../../generated/prisma/client";
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
    await prisma.user.findUniqueOrThrow({
        where: {
            id: userId,
            status: 'ACTIVE'
        },
    });

    const posts = await prisma.post.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: { select: { comments: true } },
        },
    });

    const totalPosts = posts.length;

    return { posts, totalPosts };
};


// ! Update Post by ID.
const updatePost = async (postId: string, data: Partial<Post>, authorId: string, authorRole: string) => {
    await prisma.post.findFirstOrThrow({
        where: { id: postId },
    });

    if (authorRole === 'ADMIN') {
        const post = await prisma.post.update({
            where: { id: postId },
            data,
        });
        return post;
    };

    delete data.isFeatured;
    const post = await prisma.post.update({
        where: { id: postId, authorId },
        data,
    });

    return post;
};


// ! Delete Post by ID.
const deletePost = async (postId: string, authorId: string, authorRole: string) => {
    await prisma.post.findFirstOrThrow({
        where: { id: postId },
    });

    if (authorRole === 'ADMIN') {
        const result = await prisma.post.delete({
            where: { id: postId },
        });
        return result;
    };

    const result = await prisma.post.delete({
        where: { id: postId, authorId },
    });
    return result;
};


// ! Get Stats Posts (Admin Only).
const getStatsPosts = async () => {
    const stats = await prisma.$transaction(async (tx) => {
        const totalPosts = await tx.post.count();
        const totalViews = await tx.post.aggregate({
            _sum: { views: true },
        });
        const totalComments = await tx.comment.count();
        const totalUsers = await tx.user.count();
        const adminCount = await tx.user.count({ where: { role: 'ADMIN' } });
        const featuredPosts = await tx.post.count({ where: { isFeatured: true } });
        const draftPosts = await tx.post.count({ where: { status: PostStatus.DRAFT } });
        const publishedPosts = await tx.post.count({ where: { status: PostStatus.PUBLISHED } });
        const archivedPosts = await tx.post.count({ where: { status: PostStatus.ARCHIVED } });
        return { totalPosts, totalComments, featuredPosts, draftPosts, publishedPosts, archivedPosts, totalUsers, adminCount, totalViews: totalViews._sum.views || 0 };
    });
    return stats;
};

export const postService = {
    createPost,
    getAllPosts,
    getSinglePost,
    getAllPostsByUser,
    updatePost,
    deletePost,
    getStatsPosts,
};