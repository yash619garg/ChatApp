import express from "express";
import { authorization } from "../middleware/authorization.js";
import { getMessages, sendFileMessage } from "../controller/messageController.js";
import { singleUpload } from "../middleware/multer.js";
const router = express.Router();

router.route("/getMessage/:id").get(authorization, getMessages);
router.route("/sendFileMessage").post(authorization, singleUpload, sendFileMessage);

export default router;