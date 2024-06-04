import pool from '../core/config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userQueries from '../queries/user.query';
import { User } from '../models/userInterface';

const { createUser, findUserByEmail } = userQueries;

export const createNewUser = async (firstName: string, lastName: string, email: string, password: string): Promise<User> => {
    const existingUser = await findOneUserByEmail(email);
    if (existingUser) {
        throw { code: 400, message: "User Already Exists" };
    }
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query(createUser, [firstName, lastName, email, hashedPassword, salt]);
    if (!result || !result.rows) {
        throw new Error('Failed to create user');
    }
    return result.rows[0] as User;
};

export const findOneUserByEmail = async (email: string): Promise<User | null> => {
    const result = await pool.query(findUserByEmail, [email]);
    if (result.rows.length > 0) {
        return result.rows[0] as User;
    }
    return null;
};

export const loginUser = async (email: string, password: string): Promise<{ user: User, token: string }> => {
    const user = await findOneUserByEmail(email);
    if (!user) {
        throw { code: 404, message: "User not found" };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw { code: 401, message: "Invalid credentials" };
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '1h'
    });
    return { user, token };
};
