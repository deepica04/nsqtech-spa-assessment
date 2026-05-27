import mongoose, { Document, Schema } from 'mongoose';

export interface IRecord extends Document {
  title: string;
  description: string;
  status: 'Active' | 'Pending' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  assignedTo: string;   // userId
  createdBy: string;
  category: string;
  createdAt: Date;
}

const RecordSchema = new Schema<IRecord>(
  {
    title:       { type: String, required: true },
    description: { type: String, required: true },
    status:      { type: String, enum: ['Active', 'Pending', 'Closed'], default: 'Active' },
    priority:    { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    assignedTo:  { type: String, required: true },
    createdBy:   { type: String, required: true },
    category:    { type: String, default: 'General' },
  },
  { timestamps: true }
);

export default mongoose.model<IRecord>('Record', RecordSchema);
