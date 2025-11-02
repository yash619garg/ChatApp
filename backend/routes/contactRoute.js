import express from "express";
import { getAllContacts, getContactForDMList, searchContact } from "../controller/contactController.js";
import { authorization } from "../middleware/authorization.js";
const router = express.Router();

router.route("/searchContact").post(authorization, searchContact);
router.route("/getDMContacts/:id").get(authorization, getContactForDMList);
router.route("/getAllContacts").get(authorization, getAllContacts);

export default router;