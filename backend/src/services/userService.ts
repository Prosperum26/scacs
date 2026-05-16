import { supabase } from '../config/database';
import type { Database } from '../config/database';

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

type UserRow = Database['public']['Tables']['users']['Row'];

const mapUser = (row: UserRow): User => ({
  id: row.id,
  name: row.name,
  role: row.role,
  department: row.department,
  status: row.status,
});

export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('users').select('*').order('name', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapUser);
};

export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapUser(data) : null;
};

export const createUser = async (input: CreateUserInput): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      ...input,
      status: input.status ?? 'active',
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapUser(data);
};

export const updateUser = async (id: string, input: UpdateUserInput): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapUser(data) : null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const user = await getUserById(id);

  if (!user) {
    return false;
  }

  const { error } = await supabase.from('users').delete().eq('id', id);

  if (error) {
    throw error;
  }

  return true;
};
