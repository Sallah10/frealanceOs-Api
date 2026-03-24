"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = require("../config/database");
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
class AuthService {
    async register(data) {
        const existingUser = await database_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new Error('User already exists with this email');
        }
        const hashedPassword = await (0, bcrypt_1.hashPassword)(data.password);
        const user = await database_1.prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                firstName: data.firstName,
                lastName: data.lastName,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                currency: true,
                timezone: true,
                createdAt: true,
            },
        });
        const token = (0, jwt_1.generateToken)({ userId: user.id, email: user.email });
        return { user, token };
    }
    async login(data) {
        const user = await database_1.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const isValidPassword = await (0, bcrypt_1.comparePassword)(data.password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }
        const token = (0, jwt_1.generateToken)({ userId: user.id, email: user.email });
        const { password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }
    async getMe(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                currency: true,
                avatar: true,
                timezone: true,
                raenestAccountId: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map