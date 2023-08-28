import express from "express";
import { home, login, logout, register } from "../Controller_functions/userc.js";

export const UserRouter = express.Router();


UserRouter.post("/login", login);

UserRouter.post("/register", register);

UserRouter.post("/logout", logout);

UserRouter.post("/", home);


