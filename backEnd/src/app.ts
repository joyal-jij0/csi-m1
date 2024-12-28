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


app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/user", userRouter)

export {app, server}