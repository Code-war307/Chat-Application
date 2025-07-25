import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import requestRoutes from "./routes/request.route.js"
import fileConvertRoutes from "./routes/fileFormat.route.js"
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js"


dotenv.config();
const port = process.env.PORT || 5001;
app.use(express.json({limit: "50mb"}))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    //origin: "http://localhost:3000",
    credentials: true,
})) 
app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)
app.use("/api/request", requestRoutes)
app.use("/api/file", fileConvertRoutes)

app.get("/", (req, res) => {
  res.send("Backend server is running ✅");
});

server.listen(port, () => {
    console.log(`server is running in port :  ${port}`)
    connectDB();
})
