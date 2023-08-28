import jwt from "jsonwebtoken";
import { User } from "../Schema/user.js";
import bcrypt from "bcrypt";

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username }).select("+password");

        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "Username not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET_CODE);

        res
            .cookie("Token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 15,
                sameSite: process.env.NODE_ENV === "Develpoment" ? "lax" : "none",
                secure: process.env.NODE_ENV === "Develpoment" ? false : true,
            })
            .json({
                success: true,
                message: "Logged in successfully",
            });
    } catch (error) {
        next(error);
    }
};

export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already registered.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ _id: newUser._id }, process.env.SECRET_CODE);

        res
            .cookie("Token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 15,
                sameSite: process.env.NODE_ENV === "Develpoment" ? "lax" : "none",
                secure: process.env.NODE_ENV === "Develpoment" ? false : true,
            })
            .status(201)
            .json({
                success: true,
                message: "Registered successfully.",
            });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        const { Token } = req.cookies;
        console.log(Token);
        res
            .status(200)
            .cookie("Token", "", {
                httpOnly: true,
                expires: new Date(Date.now()),
                sameSite: process.env.NODE_ENV === "Develpoment" ? "lax" : "none",
                secure: process.env.NODE_ENV === "Develpoment" ? false : true,
            })
            .json({
                success: true,
                message: "Logged out successfully"
            });
        console.log(Token);
    } catch (error) {
        next(error);
    }
};

export const home = async (req, res, next) => {
    const { Token } = req.cookies;
    if (Token) {
        return res.json({
            success: true,
            message: "welcome to home page...",
        });
    }

    res.status(302).redirect("/login"); // Use status code 302 for redirect
};

