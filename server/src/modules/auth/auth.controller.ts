// Auth Controller
// Handles HTTP requests for authentication and delegates to auth.service

import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { successResponse } from '../../shared/utils/response';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    successResponse(res, result, 'Account created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    successResponse(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tokens = await authService.refreshToken(req.body);
    successResponse(res, tokens, 'Token refreshed successfully');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await authService.getMe(req.user!.id);
    successResponse(res, user, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await authService.changePassword(req.user!.id, req.body);
    successResponse(res, null, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};
