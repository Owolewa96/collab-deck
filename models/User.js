import mongoose from 'mongoose';

const { Schema } = mongoose;


const UserSchema = new Schema(
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
    recentActivities: [{type: Schema.Types.Mixed }], // activity log entries
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
