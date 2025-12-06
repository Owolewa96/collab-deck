import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvite extends Document {
  token: string;
  projectId: any;
  email: string;
  inviter?: any;
  message?: string;
  accepted: boolean;
  acceptedBy?: any;
  acceptedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const InviteSchema = new Schema<IInvite>(
  {
    token: { type: String, required: true, unique: true },
    projectId: { type: Schema.Types.Mixed, required: true },
    email: { type: String, required: true },
    inviter: { type: Schema.Types.Mixed, default: null },
    message: { type: String, default: '' },
    accepted: { type: Boolean, default: false },
    acceptedBy: { type: Schema.Types.Mixed, default: null },
    acceptedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const Invite: Model<IInvite> = (mongoose.models.Invite as Model<IInvite>) || mongoose.model<IInvite>('Invite', InviteSchema);

export default Invite;
