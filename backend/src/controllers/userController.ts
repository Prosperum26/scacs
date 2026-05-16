import { NextFunction, Request, Response } from 'express';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '../services/userService';
import type { CreateUserInput, UpdateUserInput } from '../services/userService';

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.status(200).json({
      success: true,
      data: await getUsers(),
    });
  } catch (error) {
    next(error);
  }
};

export const createNewUser = async (
  req: Request<object, object, CreateUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, name, role, department, status } = req.body;

    if (!id || !name || !role || !department) {
      res.status(400).json({
        success: false,
        message: 'id, name, role, and department are required',
      });
      return;
    }

    if (await getUserById(id)) {
      res.status(409).json({
        success: false,
        message: 'User already exists',
      });
      return;
    }

    const user = await createUser({ id, name, role, department, status });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateExistingUser = async (
  req: Request<{ id: string }, object, UpdateUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await updateUser(req.params.id, req.body);

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExistingUser = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deleted = await deleteUser(req.params.id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User deleted',
    });
  } catch (error) {
    next(error);
  }
};
