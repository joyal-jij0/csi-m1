import {Router} from "express"
import {logoutUser, refreshAccessToken,  pushNotificationToken, signIn} from "../controllers/user.controller"
import { verifyJWT } from "../middlewares/auth.middleware"
import { createProfile, getProfile, updateProfile } from "../controllers/profile.controller"

const router = Router()

router.route("/create").post(verifyJWT, createProfile);
router.route("/update").post(verifyJWT, updateProfile);
router.route("/retrieve").get(verifyJWT, getProfile);

export default router
