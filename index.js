// const express = require('express')

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserRouter } from "./Routes/UserRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const server = express();

dotenv.config();
server.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
server.use(express.json());
server.use(cookieParser());
server.use("/api/v-1/", UserRouter);


mongoose.connect(process.env.MONGO_URI,
    { dbName: "Todo_backend_latest" })
    .then(() => console.log("Database Connected Succesfully!!"))
    .catch(() => console.log("Error while connecting Database"))


server.listen(process.env.PORT, (req, res) => {
    console.log(`Server is running on Port ${process.env.PORT} `);
})
// in ${process.env.NODE_ENV} mode...
// "start": "set NODE_ENV=Production && node index.js",
// "dev":"set NODE_ENV=Development && nodemon index.js"