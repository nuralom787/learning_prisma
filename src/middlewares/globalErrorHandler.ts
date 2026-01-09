import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    let statusCode = 500;
    let errorMessage = "Internal Server Error";
    let errorDetails = err;

    // * Check Errors
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "You Provide Incorrect Field Type Or Missing Fields!!";
    }
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
            statusCode = 400;
            errorMessage = "No Data Found For update depends on your query!!";
        }
        else if (err.code === 'P2002') {
            statusCode = 400;
            errorMessage = "Duplicate Query Data Found!!";
        }
    }
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        errorMessage = "Unknown Error From Server!!"
    }
    else if (err instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = 500;
        errorMessage = "Unknown Error From Server!!"
    }

    res.status(500)
    res.json({
        message: errorMessage,
        err: errorDetails
    })
};


export default errorHandler;