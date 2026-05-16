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

export const verifyAccess = async ({ studentId, gate }: VerifyAccessInput): Promise<VerifyAccessResult> => {
  const user = await getUserById(studentId);
  const isGranted = Boolean(user && user.status === 'active');
  const result: AccessResult = isGranted ? 'GRANTED' : 'DENIED';

  const log = await createAccessLog({
    userId: studentId,
    userName: user?.name ?? 'Unknown',
    gate,
    result,
  });

  return {
    result,
    user,
    log,
  };
};
