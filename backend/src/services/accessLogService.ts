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

const accessLogs: AccessLog[] = [
  {
    id: 'LOG-1001',
    userId: 'SV2026001',
    userName: 'Linh Tran',
    gate: 'Main Gate A',
    result: 'GRANTED',
    timestamp: new Date().toISOString(),
  },
  {
    id: 'LOG-1002',
    userId: 'UNKNOWN',
    userName: 'Unknown',
    gate: 'Dormitory B',
    result: 'DENIED',
    timestamp: new Date().toISOString(),
  },
];

export const getAccessLogs = (): AccessLog[] => accessLogs;

export const createAccessLog = (input: CreateAccessLogInput): AccessLog => {
  const log: AccessLog = {
    id: `LOG-${Date.now()}`,
    userId: input.userId,
    userName: input.userName,
    gate: input.gate ?? 'Main Gate A',
    result: input.result,
    timestamp: new Date().toISOString(),
  };

  accessLogs.unshift(log);
  return log;
};
