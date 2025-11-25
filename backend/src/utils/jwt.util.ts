import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import { Types } from "mongoose";

export function generateTokens(
    userId: string | Types.ObjectId,
    email?: string
) {
    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
        throw new Error("JWT secrets missing in environment variables");
    }

    const token = jwt.sign(
        { id: userId, email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "30d" }
    );

    const tokenIssuedAt = new Date();
    const refreshIssuedAt = new Date();

    return {
        token,
        refreshToken,
        tokenIssuedAt,
        tokenExpiresAt: dayjs(tokenIssuedAt).add(15, "minute").toDate(),
        refreshIssuedAt,
        refreshExpiresAt: dayjs(refreshIssuedAt).add(30, "day").toDate(),
    };
}
