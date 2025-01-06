import {Router} from "express"
import {createPerformance, updatePerformance, deletePerformance, getPerformance, getPerformances} from "../controllers/performance.controller"
const router: Router = Router()

import { verifyJWT } from "../middlewares/auth.middleware"

router.route("/create").post(verifyJWT, createPerformance);
router.route("/update/:performanceId").post(verifyJWT, updatePerformance);
router.route("/retrieveOne/:performanceId").get(verifyJWT, getPerformance);
router.route("/retrieveAll").get(verifyJWT, getPerformances);
router.route("/delete/:performanceId").delete(verifyJWT, deletePerformance);


export default router