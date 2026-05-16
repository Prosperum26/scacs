import { Request, Response } from 'express';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '../services/userService';
import type { CreateUserInput, UpdateUserInput } from '../services/userService';

export const getAllUsers = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: getUsers(),
  });
};

export const createNewUser = (req: Request<object, object, CreateUserInput>, res: Response): void => {
  const { id, name, role, department, status } = req.body;

  if (!id || !name || !role || !department) {
    res.status(400).json({
      success: false,
      message: 'id, name, role, and department are required',
    });
    return;
  }

  if (getUserById(id)) {
    res.status(409).json({
      success: false,
      message: 'User already exists',
    });
    return;
  }

  const user = createUser({ id, name, role, department, status });

  res.status(201).json({
    success: true,
    data: user,
  });
};

export const updateExistingUser = (
  req: Request<{ id: string }, object, UpdateUserInput>,
  res: Response
): void => {
  const user = updateUser(req.params.id, req.body);

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
};

export const deleteExistingUser = (req: Request<{ id: string }>, res: Response): void => {
  const deleted = deleteUser(req.params.id);

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
};
