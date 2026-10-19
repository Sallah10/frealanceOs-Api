// src/services/auth.service.ts
import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  UpdatePasswordInput,
  UpdateNotificationPrefsInput,
  DeleteAccountInput,
  DEFAULT_NOTIFICATION_PREFS,
} from '../validators/auth.validator';

export class AuthService {
  async register(data: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        notificationPrefs: DEFAULT_NOTIFICATION_PREFS,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        currency: true,
        timezone: true,
        notificationPrefs: true,
        createdAt: true,
      },
    });

    const token = generateToken({ userId: user.id, email: user.email });

    return { user, token };
  }

  async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (user.deletedAt) {
      throw new Error('This account has been deleted');
    }

    const isValidPassword = await comparePassword(data.password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken({ userId: user.id, email: user.email });

    const { password, deletedAt, ...userWithoutPassword } = user;
    void deletedAt;

    return { user: userWithoutPassword, token };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        currency: true,
        avatar: true,
        timezone: true,
        raenestAccountId: true,
        notificationPrefs: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        currency: true,
        avatar: true,
        timezone: true,
        raenestAccountId: true,
        notificationPrefs: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateNotificationPrefs(
    userId: string,
    data: UpdateNotificationPrefsInput,
  ) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const current = {
      ...DEFAULT_NOTIFICATION_PREFS,
      ...(user.notificationPrefs as Record<string, boolean> | null),
    };
    const prefs = { ...current, ...data };

    return prisma.user.update({
      where: { id: userId },
      data: { notificationPrefs: prefs },
      select: { notificationPrefs: true },
    });
  }

  async updatePassword(userId: string, data: UpdatePasswordInput) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await comparePassword(
      data.currentPassword,
      user.password,
    );

    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await hashPassword(data.newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  // Soft delete: we stamp deletedAt instead of removing rows so invoices,
  // clients and projects stay intact for records/tax. The user simply can no
  // longer authenticate and no longer shows up in any query.
  async softDelete(userId: string, data: DeleteAccountInput) {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await comparePassword(data.password, user.password);

    if (!isValidPassword) {
      throw new Error('Password is incorrect');
    }

    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
  }
}