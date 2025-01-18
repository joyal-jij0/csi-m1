import express, {Express} from "express"
import http from "http"
import cors from "cors"

const app: Express = express()
const server = http.createServer(app)

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({extended: true, limit: "50mb"}))
app.use(express.static("public"))

import healthcheckRouter from "./routes/healthcheck.routes"
import userRouter from "./routes/user.routes"
import profileRouter from "./routes/profile.routes"
import eventsRouter from "./routes/event.routes"
import performanceRouter from './routes/performance.routes'
import votingRouter from './routes/voting.routes'
import pushNotificationRouter from './routes/pushNotifications.routes'

app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/profile", profileRouter)
app.use("/api/v1/events", eventsRouter)
app.use("/api/v1/performance", performanceRouter)
app.use("/api/v1/voting", votingRouter)
app.use("/api/v1/pushNotification", pushNotificationRouter)

export {app, server}