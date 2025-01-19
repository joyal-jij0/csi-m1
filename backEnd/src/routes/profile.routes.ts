import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware"
import { createProfile, getProfile, updateProfile, profileExists } from "../controllers/profile.controller"

const router = Router()

router.route("/create").post(verifyJWT, createProfile);
router.route("/update").post(verifyJWT, updateProfile);
router.route("/retrieve").get(verifyJWT, getProfile);
router.route("/check").get(verifyJWT, profileExists)

export default router
