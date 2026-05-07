// Admin Controller
// Handles HTTP requests for staff admin user management operations

import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';
import { successResponse, paginatedResponse } from '../../shared/utils/response';
import { parsePaginationParams } from '../../shared/utils/pagination';

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await adminService.createUser(
      req.user!.role,
      req.user!.id,
      req.body
    );
    successResponse(res, user, 'User created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit } = parsePaginationParams(req.query.page as string, req.query.limit as string);
    
    const filters = {
      role: req.query.role as any,
      isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
      search: req.query.search as string,
    };

    const { users, total } = await adminService.getUsers(page, limit, filters);
    
    paginatedResponse(res, users, page, limit, total, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await adminService.updateUser(
      req.user!.role,
      req.user!.id,
      req.params.userId,
      req.body
    );
    successResponse(res, user, 'User updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await adminService.deleteUser(
      req.user!.role,
      req.user!.id,
      req.params.userId
    );
    successResponse(res, null, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const assignReviewers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const assignments = await adminService.assignReviewers(
      req.user!.id,
      req.body
    );
    successResponse(res, assignments, 'Reviewers assigned successfully');
  } catch (error) {
    next(error);
  }
};

export const getReviewerAssignments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const assignments = await adminService.getReviewerAssignments();
    successResponse(res, assignments, 'Reviewer assignments retrieved successfully');
  } catch (error) {
    next(error);
  }
};