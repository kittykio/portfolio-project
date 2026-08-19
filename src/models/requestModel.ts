import mongoose, { Model, Schema } from 'mongoose';

export type RequestKind = 'project' | 'article' | 'contact';
export type RequestStatus = 'new' | 'considering' | 'building' | 'published';

export interface IRequestDocument {
  kind: RequestKind;
  status: RequestStatus;
  title: string;
  details: string;
  contact?: string;
  timeline?: string;
  budget?: string;
  preferredContact?: string;
  locale: 'en' | 'ja';
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema = new Schema<IRequestDocument>(
  {
    kind: { type: String, enum: ['project', 'article', 'contact'], required: true },
    status: { type: String, enum: ['new', 'considering', 'building', 'published'], default: 'new' },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    details: { type: String, required: true, trim: true, maxlength: 6000 },
    contact: { type: String, trim: true, maxlength: 320 },
    timeline: { type: String, trim: true, maxlength: 120 },
    budget: { type: String, trim: true, maxlength: 120 },
    preferredContact: { type: String, trim: true, maxlength: 80 },
    locale: { type: String, enum: ['en', 'ja'], required: true },
  },
  { timestamps: true },
);

// Next.js development hot reload can retain an older compiled Mongoose model.
// Recreate it in development so new schema fields/enums apply without a stale validator.
if (process.env.NODE_ENV === 'development' && mongoose.models.PortfolioRequest) {
  mongoose.deleteModel('PortfolioRequest');
}

const RequestModel: Model<IRequestDocument> =
  (mongoose.models.PortfolioRequest as Model<IRequestDocument>) ||
  mongoose.model<IRequestDocument>('PortfolioRequest', RequestSchema, 'portfolio_requests');

export default RequestModel;
