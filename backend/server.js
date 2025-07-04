import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import requestRoutes from "./routes/request.route.js"
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js"


dotenv.config();
const port = process.env.PORT || 5001;
app.use(express.json({limit: "50mb"}))
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
})) 
app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)
app.use("/api/request", requestRoutes)

server.listen(port, () => {
    console.log(`server is running in port :  ${port}`)
    connectDB();
})