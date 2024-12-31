import {Router} from "express"
import {createEvent, updateEvent, deleteEvent, getEvent, getEvents} from "../controllers/event.controller"
const router: Router = Router()

import { verifyJWT } from "../middlewares/auth.middleware"

router.route("/create").post(verifyJWT, createEvent);
router.route("/update/:eventId").post(verifyJWT, updateEvent);
router.route("/retrieveOne/:eventId").get(verifyJWT, getEvent);
router.route("/retrieveAll").get(verifyJWT, getEvents);
router.route("/delete/:eventId").delete(verifyJWT, deleteEvent);


export default router