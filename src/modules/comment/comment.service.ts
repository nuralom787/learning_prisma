import { prisma } from "../../lib/prisma";

const createComment = async (payload: { content: string, authorId: string, postId: string, parentId?: string }) => {

    // Validation could be added here
    const { content, authorId, postId, parentId } = payload;

    const postData = await prisma.post.findUniqueOrThrow({
        where: { id: postId },
    });


    if (parentId) {
        const parentComment = await prisma.comment.findUniqueOrThrow({
            where: { id: parentId },
        });
    };


    // Create comment in the database
    const result = await prisma.comment.create({
        data: payload
    });
    return result;
};


const getCommentsById = async (commentId: string) => {
    const comments = await prisma.comment.findUnique({
        where: { id: commentId },
        include: {
            replies: true,
            post: {
                select: { id: true, title: true },
            },
        },
    });
    return comments;
};


const getCommentsByAuthorId = async (authorId: string) => {
    const comments = await prisma.comment.findMany({
        where: { authorId },
        orderBy: { createdAt: 'desc' },
        include: {
            post: {
                select: { id: true, title: true },
            },
        },
    });
    return comments;
};


const deleteComment = async (data: { userId: string, userRole: string, commentId: string }) => {

    // if (data.userRole === 'ADMIN') {
    //     const deletedComment = await prisma.comment.delete({
    //         where: {
    //             AND: [
    //                 {
    //                     commentId: {
    //                         contains: data.commentId
    //                     }
    //                 },
    //             ]
    //         }
    //     });
    //     return data;
    // };

    if (data.userRole === 'USER') {
        const deletedComment = await prisma.comment.delete({
            where: { id: data.commentId, authorId: data.userId },
        });
        return data;
    };
};


export const commentService = {
    createComment,
    getCommentsById,
    getCommentsByAuthorId,
    deleteComment,
};