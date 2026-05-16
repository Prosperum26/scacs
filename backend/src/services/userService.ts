export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: string;
  name: string;
  role: 'student' | 'faculty' | 'staff';
  department: string;
  status: UserStatus;
}

export interface CreateUserInput {
  id: string;
  name: string;
  role: User['role'];
  department: string;
  status?: UserStatus;
}

export type UpdateUserInput = Partial<Omit<User, 'id'>>;

const users: User[] = [
  {
    id: 'SV2026001',
    name: 'Linh Tran',
    role: 'student',
    department: 'Computer Science',
    status: 'active',
  },
  {
    id: 'SV2026042',
    name: 'Minh Nguyen',
    role: 'student',
    department: 'Business',
    status: 'active',
  },
  {
    id: 'FC1108',
    name: 'Dr. An Pham',
    role: 'faculty',
    department: 'Engineering',
    status: 'active',
  },
  {
    id: 'ST3302',
    name: 'Bao Le',
    role: 'staff',
    department: 'Library',
    status: 'suspended',
  },
];

export const getUsers = (): User[] => users;

export const getUserById = (id: string): User | undefined =>
  users.find((user) => user.id.toLowerCase() === id.toLowerCase());

export const createUser = (input: CreateUserInput): User => {
  const user: User = {
    ...input,
    status: input.status ?? 'active',
  };

  users.push(user);
  return user;
};

export const updateUser = (id: string, input: UpdateUserInput): User | null => {
  const user = getUserById(id);

  if (!user) {
    return null;
  }

  Object.assign(user, input);
  return user;
};

export const deleteUser = (id: string): boolean => {
  const index = users.findIndex((user) => user.id.toLowerCase() === id.toLowerCase());

  if (index === -1) {
    return false;
  }

  users.splice(index, 1);
  return true;
};
