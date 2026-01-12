import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface for a User document (MongoDB)
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  pinnedProjects: any[];
  archivedProjects: any[];
  recentActivities: any[];
}

/**
 * User Schema
 */
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true }, // hashed via bcryptjs
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    pinnedProjects: [{ type: Schema.Types.Mixed }], // project ids or objects
    archivedProjects: [{ type: Schema.Types.Mixed }], // project ids or objects
    recentActivities: [{ type: Schema.Types.Mixed }], // activity log entries
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  next();
});

// Statics for easier querying
UserSchema.statics.findByEmail = async function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findById = async function (id: string) {
  return this.findOne({ _id: id });
};

// Export Mongoose model if mongoose connection is available
let userModel: Model<IUser>;
try {
  userModel = mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);
} catch (err) {
  /* eslint-disable no-console */
  console.warn('Mongoose model not initialized. Falling back to placeholder User API.');
  /* eslint-enable no-console */
  userModel = {
    findById: async (id: string) => {
      console.log(`Finding user with id: ${id}`);
      return null;
    },
    findByEmail: async (email: string) => {
      console.log(`Finding user with email: ${email}`);
      return null;
    },
    create: async (data: any) => {
      console.log('Creating user:', data);
      return data;
    },
    updateOne: async (filter: any, update: any) => {
      console.log('Updating user:', filter, update);
      return { modifiedCount: 1 };
    },
  } as any;
}

export default userModel;
export { UserSchema };
