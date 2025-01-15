import {Router} from "express"
import {createEvent, updateEvent, deleteEvent, getEvent, getEvents, getTopThree, getAllEvents} from "../controllers/event.controller"
const router: Router = Router()

import { verifyJWT } from "../middlewares/auth.middleware"

router.route("/create").post(verifyJWT, createEvent);
router.route("/update/:eventId").post(verifyJWT, updateEvent);
router.route("/retrieveOne/:eventId").get(verifyJWT, getEvent);
// router.route("/retrieveAll").get(verifyJWT, getEvents);
router.route("/retrieveAll").get(verifyJWT, getAllEvents);
router.route("/delete/:eventId").delete(verifyJWT, deleteEvent);
router.route("/getTopThree/:eventId").get(getTopThree);


export default router