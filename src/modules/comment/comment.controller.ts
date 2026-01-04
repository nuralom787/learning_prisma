import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
    try {
        const payload = { requestBody: req.body, user: req.user };
        const result = await commentService.createComment(payload);
        res.status(201).json(result);
    }
    catch (err) {
        throw new Error("Unable to create comment");
    };
};

export const commentController = {
    createComment,
};