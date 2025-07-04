import mongoose from "mongoose";
export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB is already connected.");
    return;
    }

    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongo DB is connected successfully ${connection.connection.host}`)
    } catch (error) {
        console.error("Mongo DB connection failed", error)
    }
}