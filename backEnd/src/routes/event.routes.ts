import {Router} from "express"
import {createEvent, updateEvent, deleteEvent, getEvent, getEvents} from "../controllers/event.controller"
const router: Router = Router()

router.route("/create").post(createEvent);
router.route("/update/:eventId").post(updateEvent);
router.route("/retrieveOne/:eventId").get(getEvent);
router.route("/retrieveAll").get(getEvents);
router.route("/delete/:eventId").delete(deleteEvent);


export default router