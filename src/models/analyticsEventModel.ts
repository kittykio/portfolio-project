import mongoose, { Schema } from 'mongoose';
const AnalyticsEventSchema = new Schema({ name: { type: String, required: true, maxlength: 80 }, path: { type: String, maxlength: 300 }, label: { type: String, maxlength: 200 }, locale: { type: String, enum: ['en', 'ja'] }, meta: { type: Schema.Types.Mixed } }, { timestamps: true });
export default (mongoose.models.PortfolioAnalyticsEvent || mongoose.model('PortfolioAnalyticsEvent', AnalyticsEventSchema, 'portfolio_analytics_events'));
