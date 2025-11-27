import express from "express";
import {signup,signin} from "../controllers/auth.controller";
import{requestPasswordReset,resetPassword} from "../controllers/auth.controller";
const router =express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/requestPasswordReset",requestPasswordReset);
router.post("/resetPassword",resetPassword);

export default router;