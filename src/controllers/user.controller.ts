// import { NextFunction, Request, Response } from "express";
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import { createNewUser, findOneUserByEmail, loginUser } from '../services/user.service';
// import dotenv from 'dotenv';

// dotenv.config();

// export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
//     const { firstName, lastName, email, password } = req.body;

//     try {
//         const existingUser = await findOneUserByEmail(email);
//         if (existingUser) {
//             return res.status(400).json({
//                 code: 400,
//                 message: "User Already Exists"
//             });
//         }

//         const user = await createNewUser(firstName, lastName, email, password);

//         return res.status(201).json({
//             id: user.id,
//             code: 201,
//             message: "User created successfully",
//             data: { email: user.email }
//         });
//     } catch (error) {
//         return res.status(500).json({
//             code: 500,
//             message: "Internal Server Error"
//         });
//     }
// };

// export const logIn = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
//     const { email, password } = req.body;

//     try {
//         const user = await loginUser(email, password);
//         const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);

//         return res.status(200).json({
//             id: user.id,
//             code: 200,
//             message: "Login successful",
//             data: { token }
//         });
//     } catch (error) {
//         return res.status(500).json({
//             code: 500,
//             message: "Internal Server Error"
//         });
//     }
// };

// export const loginController = async (req: Request, res: Response, next: NextFunction) => {
//     const { email, password } = req.body;
//     try {
//         const user = await loginUser(email, password);
//         const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string);
//         res.status(200).json({ message: 'Login successful', token });
//     } catch (error) {
//         next(error);
//     }
// };


import { NextFunction, Request, Response } from "express";
import { createNewUser, findOneUserByEmail, loginUser } from '../services/user.service';

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingUser = await findOneUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                code: 400,
                message: "User Already Exists"
            });
        }

        const user = await createNewUser(firstName, lastName, email, password);

        return res.status(201).json({
            id: user.id,
            code: 201,
            message: "User created successfully",
            data: { email: user.email }
        });
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Internal Server Error"
        });
    }
};

export const logIn = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const { email, password } = req.body;

    try {
        const user = await loginUser(email, password);

        return res.status(200).json({
            code: 200,
            message: "Login successful",
            data: { token: user.token }
        });
    } catch (error) {
        if ((error as Error).message === 'Invalid credentials') {
            return res.status(401).json({
                code: 401,
                message: "Invalid credentials"
            });
        }
        return res.status(500).json({
            code: 500,
            message: "Internal Server Error"
        });
    }
};
