import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database';
import { User } from '../models/User';
import { Gate } from '../models/Gate';
import { AccessLog } from '../models/AccessLog';
import { Alert } from '../models/Alert';

const departments = [
  'Computer Science',
  'Information Systems',
  'Electrical Engineering',
  'Business Administration',
  'Mechanical Engineering',
];

const gates = [
  { name: 'Main Gate', zone: 'Campus Entrance' },
  { name: 'Library', zone: 'Academic Zone' },
  { name: 'Dormitory', zone: 'Residential' },
  { name: 'Parking Area', zone: 'Transport' },
  { name: 'Laboratory Building', zone: 'Research' },
];

const firstNames = ['Minh', 'Lan', 'Hùng', 'Thảo', 'An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Khoa'];
const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Võ', 'Đặng', 'Bùi'];

async function seed() {
  await connectDatabase();

  await Promise.all([User.deleteMany({}), Gate.deleteMany({}), AccessLog.deleteMany({}), Alert.deleteMany({})]);

  const passwordHash = await bcrypt.hash('Password123!', 12);

  await User.create({
    email: 'admin@scacs.edu',
    passwordHash,
    fullName: 'Security Admin',
    studentId: 'ADM-001',
    department: 'Campus Security',
    role: 'admin',
    status: 'active',
    accessLevel: 'Full Control',
  });

  const students = [];
  for (let i = 1; i <= 24; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const studentId = `SV2026${String(i).padStart(3, '0')}`;
    students.push(
      await User.create({
        email: `${studentId.toLowerCase()}@student.scacs.edu`,
        passwordHash,
        fullName: `${ln} ${fn}`,
        studentId,
        department: departments[i % departments.length],
        role: 'student',
        status: i === 5 ? 'suspended' : i === 8 ? 'inactive' : 'active',
        accessLevel: i % 3 === 0 ? 'Extended Campus' : 'Standard Campus',
      }),
    );
  }

  await Gate.insertMany(gates);

  const now = Date.now();
  const logs = [];
  for (let d = 0; d < 7; d++) {
    for (let j = 0; j < 12; j++) {
      const student = students[j % students.length];
      const gate = gates[j % gates.length].name;
      const granted = Math.random() > 0.15;
      logs.push({
        userId: student._id,
        studentId: student.studentId,
        studentName: student.fullName,
        gate,
        status: granted ? 'GRANTED' : 'DENIED',
        method: 'QR',
        reason: granted ? undefined : 'QR code expired',
        timestamp: new Date(now - d * 86400000 - j * 3600000),
      });
    }
  }
  await AccessLog.insertMany(logs);

  await Alert.insertMany([
    {
      type: 'failed_scans',
      severity: 'medium',
      title: 'Multiple failed scans',
      message: 'SV2026012 had 4 denied attempts in 5 minutes at Main Gate',
      studentId: 'SV2026012',
      gate: 'Main Gate',
    },
    {
      type: 'duplicate_qr',
      severity: 'high',
      title: 'Duplicate QR attempt',
      message: 'Reused QR detected for SV2026003 at Library',
      studentId: 'SV2026003',
      gate: 'Library',
    },
    {
      type: 'expired_token_abuse',
      severity: 'low',
      title: 'Expired QR scanned',
      message: 'Expired token scan at Parking Area',
      gate: 'Parking Area',
    },
  ]);

  console.log('\n✅ SCACS database seeded!\n');
  console.log('Admin:  admin@scacs.edu / Password123!');
  console.log('Student: sv2026001@student.scacs.edu / Password123!');
  console.log(`Created ${students.length} students, ${gates.length} gates, ${logs.length} access logs\n`);

  await disconnectDatabase();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
