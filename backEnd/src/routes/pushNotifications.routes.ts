import {Router} from "express"
import { sendNotification } from "../controllers/pushNotifications.controller";
const router: Router = Router()

import { verifyJWT } from "../middlewares/auth.middleware"

router.route("/").post(verifyJWT, sendNotification)

export default router