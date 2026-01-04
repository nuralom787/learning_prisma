import { Request, Response } from "express";
import { postService } from "./post.service";
import pagination from "../../helpers/paginationHelper";

// ! Create New Posts.
const createPost = async (req: Request, res: Response) => {
    try {
        // console.log(req.user);
        const result = await postService.createPost(req.body, req.user?.id as string);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create post" });
    }
};

// ! Get All Posts with Filters.
const getAllPosts = async (req: Request, res: Response) => {
    try {
        const search = req.query.search as string | undefined;
        const isFeatured = req.query.isFeatured as string | undefined;
        const status = req.query.status as string | undefined;
        const authorId = req.query.authorId as string | undefined;
        const { skip, take, orderBy } = pagination(req.query);
        const tags = req.query.tags as string | undefined;
        const tagsArray = tags ? tags.split(',') : undefined;

        const posts = await postService.getAllPosts({ search, isFeatured, status, authorId, tags: tagsArray, skip, take, orderBy });
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get posts" });
    }
};

// ! Get Single Post by ID.
const getSinglePost = async (req: Request, res: Response) => {
    try {
        const post = await postService.getSinglePost(req.params.id as string);
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get post" });
    }
};

export const postController = {
    createPost,
    getAllPosts,
    getSinglePost,
};