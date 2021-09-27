// Packages
import express from "express";
import bcrpt from "bcryptjs";
import jwt from "jsonwebtoken";

// Models
import { UserModel } from "../../database/user"

const Router = express.Router();

/*
Route       - /signup
Description - Signup with email and password
Params      - None
Access      - Public
Method      - POST
*/

Router.post("/signup", async(req, res) => {
    try {
        const { email, password, fullname, phoneNumber } = req.body.credentials;

        // Check whether email or phone number already exists.
        const checkUserByEmail = await UserModel.findOne({ email });
        const checkUserByPhone = await UserModel.findOne({ phoneNumber });

        if (checkUserByEmail || checkUserByPhone) {
            return res.json({error: "User already exists"})
        }

        // Hashing and salting
        const bcryptSalt = await bcrpt.genSalt(8);
        const hashedPassword = await bcrpt.hash(password, bcryptSalt);

        // DataBase
        await UserModel.create({
            ...req.body.credentials,
            password: hashedPassword
        });

        // JWT Auth Token
        const token = jwt.sign({user: {fullname, email}}, "Shimato" );
        return res.status(200).json({token})
    }
    catch (error) {
        return res.status(500).json({ error: "User already Exists" });
    }
});

export default Router;