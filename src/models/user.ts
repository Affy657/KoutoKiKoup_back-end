import { Schema, model, Document } from 'mongoose';

enum Role {
  User = 'user',
  Admin = 'admin'
}

interface user extends Document {
  username: string;
  password: string;
  role: string;
}

export const userSchema = new Schema<user>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: Role.User, enum: Object.values(Role) }
});

export default model<user>('User', userSchema);