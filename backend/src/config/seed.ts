import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Record from '../models/Record';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('Connected to MongoDB for seeding...');

  await User.deleteMany({});
  await Record.deleteMany({});

  const users = await User.insertMany([
    { userId: 'admin001', name: 'Alice Admin',   email: 'admin@nsqtech.com', password: 'Admin@123',  role: 'Admin',        department: 'IT' },
    { userId: 'user001',  name: 'Bob General',   email: 'bob@nsqtech.com',   password: 'User@123',   role: 'General User', department: 'Sales' },
    { userId: 'user002',  name: 'Carol General', email: 'carol@nsqtech.com', password: 'User@123',   role: 'General User', department: 'HR' },
    { userId: 'user003',  name: 'Dave General',  email: 'dave@nsqtech.com',  password: 'User@123',   role: 'General User', department: 'Finance' },
  ]);

  console.log('Seeded ' + users.length + ' users');

  const records = await Record.insertMany([
    { title: 'Setup VPN Access',       description: 'Configure VPN for remote team',         status: 'Active',  priority: 'High',   assignedTo: 'user001', createdBy: 'admin001', category: 'IT Support' },
    { title: 'Q1 Sales Report',        description: 'Compile Q1 sales data for review',       status: 'Pending', priority: 'Medium', assignedTo: 'user001', createdBy: 'admin001', category: 'Reporting' },
    { title: 'Onboarding Carol',       description: 'HR onboarding checklist for Carol',      status: 'Active',  priority: 'High',   assignedTo: 'user002', createdBy: 'admin001', category: 'HR' },
    { title: 'Budget Approval',        description: 'Approve Q2 department budget',           status: 'Pending', priority: 'High',   assignedTo: 'user003', createdBy: 'admin001', category: 'Finance' },
    { title: 'Software License Audit', description: 'Audit all software licenses',            status: 'Active',  priority: 'Low',    assignedTo: 'user001', createdBy: 'admin001', category: 'IT Support' },
    { title: 'Training Schedule',      description: 'Prepare monthly training schedule',      status: 'Closed',  priority: 'Low',    assignedTo: 'user002', createdBy: 'admin001', category: 'HR' },
    { title: 'Invoice Processing',     description: 'Process vendor invoices for April',      status: 'Active',  priority: 'Medium', assignedTo: 'user003', createdBy: 'admin001', category: 'Finance' },
    { title: 'Security Patch Deploy',  description: 'Deploy critical security patches',       status: 'Active',  priority: 'High',   assignedTo: 'user001', createdBy: 'admin001', category: 'IT Support' },
  ]);

  console.log('Seeded ' + records.length + ' records');
  console.log('Login: admin001 / Admin@123 / Admin');
  console.log('Login: user001  / User@123  / General User');

  await mongoose.disconnect();
  console.log('Seeding complete!');
};

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
