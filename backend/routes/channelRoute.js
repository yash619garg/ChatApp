import express from 'express';
import { createChannel, getChannelById, getChannelMessages } from '../controller/channelController.js';
import { authorization } from '../middleware/authorization.js';
const router = express.Router();


router.post("/createChannel", authorization, createChannel);
router.get("/getUserChannel", authorization, getChannelById);
router.get("/getChannelMessages/:id", authorization, getChannelMessages);

export default router;