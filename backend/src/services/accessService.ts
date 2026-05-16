import { createAccessLog } from './accessLogService';
import type { AccessLog, AccessResult } from './accessLogService';
import { getUserById } from './userService';
import type { User } from './userService';

export interface VerifyAccessInput {
  studentId: string;
  gate?: string;
}

export interface VerifyAccessResult {
  result: AccessResult;
  user: User | null;
  log: AccessLog;
}

export const verifyAccess = ({ studentId, gate }: VerifyAccessInput): VerifyAccessResult => {
  const user = getUserById(studentId);
  const isGranted = Boolean(user && user.status === 'active');
  const result: AccessResult = isGranted ? 'GRANTED' : 'DENIED';

  const log = createAccessLog({
    userId: studentId,
    userName: user?.name ?? 'Unknown',
    gate,
    result,
  });

  return {
    result,
    user: user ?? null,
    log,
  };
};
