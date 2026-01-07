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


// ! Get All Posts by User ID.
const getAllPostsByUser = async (req: Request, res: Response) => {
    try {
        const posts = await postService.getAllPostsByUser(req.user?.id as string);
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to get posts by user" });
    }
};


// ! Update Post by ID.
const updatePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id as string;
        const data = req.body;
        const authorId = req.user?.id as string;
        const authorRole = req.user?.role as string;
        const updatedPost = await postService.updatePost(postId, data, authorId, authorRole);
        res.status(200).json(updatedPost);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update post" });
    }
};


// ! Delete Post by ID.
const deletePost = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id as string;
        const authorId = req.user?.id as string;
        const authorRole = req.user?.role as string;
        const deletePost = await postService.deletePost(postId, authorId, authorRole);
        res.status(204).json(deletePost);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete post" });
    }
};

export const postController = {
    createPost,
    getAllPosts,
    getSinglePost,
    getAllPostsByUser,
    updatePost,
    deletePost,
};