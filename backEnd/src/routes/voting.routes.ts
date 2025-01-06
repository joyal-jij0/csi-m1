import {Router} from "express"
import { createSSEStream, submitVote, startVoting, endVoting  } from "../controllers/voting.controller"
const router: Router = Router()

import { verifyJWT } from "../middlewares/auth.middleware"

router.route("/getStream/:performanceId").get(createSSEStream);
router.route("/submitVote/:performanceId").post(verifyJWT, submitVote);
router.route("/startVoting/:performanceId").post(verifyJWT, startVoting);
router.route("/endVoting/:performanceId").post(verifyJWT, endVoting);

export default router