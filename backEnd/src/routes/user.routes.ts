import {Router} from "express"
import {logoutUser, refreshAccessToken,  pushNotificationToken, signIn} from "../controllers/user.controller"
import { verifyJWT } from "../middlewares/auth.middleware"

const router = Router()


router.route("/signIn").post(signIn)

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/update-push-token").post(verifyJWT, pushNotificationToken)

export default router