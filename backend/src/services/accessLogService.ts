import { supabase } from '../config/database';
import type { Database } from '../config/database';

export type AccessResult = 'GRANTED' | 'DENIED';

export interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  gate: string;
  result: AccessResult;
  timestamp: string;
}

export interface CreateAccessLogInput {
  userId: string;
  userName: string;
  gate?: string;
  result: AccessResult;
}

type AccessLogRow = Database['public']['Tables']['access_logs']['Row'];

const mapAccessLog = (row: AccessLogRow): AccessLog => ({
  id: row.id,
  userId: row.user_id,
  userName: row.user_name,
  gate: row.gate,
  result: row.result,
  timestamp: row.timestamp,
});

export const getAccessLogs = async (): Promise<AccessLog[]> => {
  const { data, error } = await supabase.from('access_logs').select('*').order('timestamp', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapAccessLog);
};

export const createAccessLog = async (input: CreateAccessLogInput): Promise<AccessLog> => {
  const { data, error } = await supabase
    .from('access_logs')
    .insert({
      id: `LOG-${Date.now()}`,
      user_id: input.userId,
      user_name: input.userName,
      gate: input.gate ?? 'Main Gate A',
      result: input.result,
      timestamp: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return mapAccessLog(data);
};
