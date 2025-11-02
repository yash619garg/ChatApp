import express from 'express';
const router = express.Router();

import { getUserDetails, login, logout, register, removeProfile, updateProfile, updateProfileImage } from '../controller/userController.js';
import { authorization } from '../middleware/authorization.js';
import formidable from 'formidable';
import { singleUpload } from '../middleware/multer.js';


router.route("/signup").post(register)
router.route("/login").post(login)
router.route("/logout").post(authorization, logout)
router.route("/getUser").get(authorization, getUserDetails);
router.route("/updateProfile").put(authorization, updateProfile);
router.route("/removeProfile").put(authorization, removeProfile);
router.route("/uploadProfileImage").post(authorization, singleUpload, updateProfileImage);

export default router;