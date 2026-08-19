// Importing mongoose library along with Document and Model types from it
import mongoose, { Schema, Model } from 'mongoose';

// --- 1. Base Interface: Defines the core data structure (plain object) ---

/**
 * Defines the core structure for Blog Like statistics.
 * The _id is assumed to be the unique identifier of the blog post itself.
 */
export interface IBlogLike {
  _id: number; // Unique ID for the blog post
  like: number; // The current count of likes for that blog post
}

// --- 2. Document Interface: Extends the base interface to include Mongoose timestamps ---

/**
 * Defines the Mongoose Document shape, including Mongoose's built-in fields.
 */
export interface IBlogLikeDocument extends IBlogLike {
  createdAt: Date;
  updatedAt: Date;
}

// --- 3. Mongoose Schema: Typed with the Document interface ---

/**
 * Mongoose Schema definition for Blog Like documents.
 */
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
      default: 0, // Setting a sensible default
    },
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
    _id: false,
  },
);

// --- 4. Mongoose Model: Apply hot-reloading pattern ---

// Define the model variable with its correct type.
let BlogLikeModel: Model<IBlogLikeDocument>;

// Check if the model already exists in Mongoose (for Next.js hot reload).
if (mongoose.models.PortfolioBlogLike) {
  // Use existing model, asserting its type.
  BlogLikeModel = mongoose.models.PortfolioBlogLike as Model<IBlogLikeDocument>;
} else {
  // Create the new model, registered under the name 'Blog' (as per your original code).
  BlogLikeModel = mongoose.model<IBlogLikeDocument>(
    'PortfolioBlogLike',
    BlogLikeSchema,
    'portfolio_blog_likes',
  );
}

// Export the model (renamed from BlogCollection to BlogLikeModel for clarity).
export default BlogLikeModel;
