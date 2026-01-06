import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    try {
        req.body.authorId = req.user?.id;
        const result = await commentService.createComment(req.body);
        res.status(201).json(result);
    }
    catch (err) {
        console.log(err);
        throw err;
    };
};


const getCommentsById = async (req: Request, res: Response) => {
    try {
        const result = await commentService.getCommentsById(req.params.id as string);
        res.status(200).json(result);
    }
    catch (err) {
        console.log(err);
        throw err;
    };
};


const getCommentsByAuthorId = async (req: Request, res: Response) => {
    try {
        const result = await commentService.getCommentsByAuthorId(req.params.authorId as string);
        res.status(200).json(result);
    }
    catch (err) {
        console.log(err);
        throw err;
    };
};


const deleteComment = async (req: Request, res: Response) => {
    try {
        let data: any = {};
        data.userId = req.user?.id;
        data.userRole = req.user?.role;
        data.commentId = req.params.id;
        const result = await commentService.deleteComment(data);
        res.status(200).json(result);
    }
    catch (err) {
        console.log(err);
        throw err;
    };
};


const updateComment = async (req: Request, res: Response) => {
    try {
        const authorId = req.user?.id;
        const commentId = req.params.id;
        const body = req.body;
        const result = await commentService.updateComment(commentId as string, authorId as string, body);
        res.status(200).json(result);
    }
    catch (err) {
        console.log(err);
        throw err;
    };
};



export const commentController = {
    createComment,
    getCommentsById,
    getCommentsByAuthorId,
    deleteComment,
    updateComment,
};