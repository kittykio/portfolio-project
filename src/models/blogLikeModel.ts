import mongoose, { Schema, Model } from 'mongoose';

/** Reaction totals use the stable numeric ID derived from an article slug. */
export interface IBlogLike {
  _id: number;
  like: number;
}

export interface IBlogLikeDocument extends IBlogLike {
  createdAt: Date;
  updatedAt: Date;
}

export const BlogLikeSchema = new Schema<IBlogLikeDocument>(
  {
    _id: {
      type: Number,
      required: true,
      auto: false,
    },
    like: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    _id: false,
  },
);

let BlogLikeModel: Model<IBlogLikeDocument>;

// Reuse the registered model during Next.js hot reloads to avoid OverwriteModelError.
if (mongoose.models.PortfolioBlogLike) {
  BlogLikeModel = mongoose.models.PortfolioBlogLike as Model<IBlogLikeDocument>;
} else {
  BlogLikeModel = mongoose.model<IBlogLikeDocument>(
    'PortfolioBlogLike',
    BlogLikeSchema,
    'portfolio_blog_likes',
  );
}

export default BlogLikeModel;
