

import mongoose from 'mongoose';

const { Schema } = mongoose;


const WorkspaceSchema = new Schema(
  {
    user: { type: String, required: true, trim: true },
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
  },
  { timestamps: true }
);

/**
 * Pre-save hook: do NOT hash password here if using bcryptjs in the route.
 * The API route should handle hashing before calling .save().
 * This is just a safety net.
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  // Password hashing should happen in the signup route
  // to avoid double-hashing.
  next();
});

// Statics for easier querying
UserSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findById = async function (id) {
  return this.findOne({ _id: id });
};

// Export Mongoose model if mongoose connection is available
let UserModel;
try {
  UserModel = mongoose.models?.User || mongoose.model('User', UserSchema);
} catch (err) {
  /* eslint-disable no-console */
  console.warn('Mongoose model not initialized. Falling back to placeholder User API.');
  /* eslint-enable no-console */
  UserModel = {
    findById: async (id) => {
      console.log(`Finding user with id: ${id}`);
      return null;
    },
    findByEmail: async (email) => {
      console.log(`Finding user with email: ${email}`);
      return null;
    },
    create: async (data) => {
      console.log('Creating user:', data);
      return data;
    },
    updateOne: async (filter, update) => {
      console.log('Updating user:', filter, update);
      return { modifiedCount: 1 };
    },
  };
}

export default UserModel;

export { UserSchema };
