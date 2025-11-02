import { myError } from "../config/error.js";

export const asyncHandler = (f1) => async (req, res, next) => {
    try {
        await f1(req, res, next);

    } catch (error) {
        console.log(error.message);
        if (error instanceof myError) {
            res.status(error.statusCode).json({ error: error.message })
        }
        else {
            res.status(500).json({ error: error.message })

        }

    }
}