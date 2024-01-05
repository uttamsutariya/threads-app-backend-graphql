import { prisma } from "../lib/db";
import { createHmac, randomBytes } from "crypto";
import JWT from "jsonwebtoken";

export interface CreateUserPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface GetUserTokenPayload {
    email: string;
    password: string;
}

class UserService {
    public static async createUser(payload: CreateUserPayload) {
        const salt = randomBytes(32).toString("hex");
        const hashedPassword = UserService.generateHash(salt, payload.password);

        const user = await prisma.user.create({
            data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                password: hashedPassword,
                salt: salt,
            },
        });
        return user;
    }

    public static async getUserToken(payload: GetUserTokenPayload) {
        const { email, password } = payload;
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        const salt = user.salt;
        const hashedPassword = UserService.generateHash(salt, password);

        if (user.password !== hashedPassword) {
            throw new Error("Password is incorrect");
        }

        const token = JWT.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET || "custom",
            {
                expiresIn: "1h",
            }
        );

        return token;
    }

    private static generateHash(salt: string, password: string) {
        return createHmac("sha256", salt).update(password).digest("hex");
    }

    public static async getUserByEmail(email: string) {
        console.log("email", email);
        return await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    public static decodeToken(token: string) {
        try {
            const decoded = JWT.verify(token, process.env.JWT_SECRET || "custom");
            return decoded;
        } catch (error) {
            throw new Error("Invalid token");
        }
    }
}

export default UserService;
