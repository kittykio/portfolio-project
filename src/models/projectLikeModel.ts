// Importing mongoose library along with its types
import mongoose, { Schema, Model } from 'mongoose';

// --- 1. Base Interface: Defines the core data structure (plain object) ---

/**
 * Defines the core structure for the Like data.
 * NOTE: Using `_id: number` suggests this ID is manually managed, not a standard ObjectID.
 */
export interface IProjectLike {
  _id: number;
  like: number; // The count of likes for a specific ID.
}

// --- 2. Document Interface: Extends the base interface to include Mongoose timestamps ---

/**
 * Defines the Mongoose Document shape, including Mongoose's built-in fields.
 */
export interface IProjectLikeDocument extends IProjectLike {
  createdAt: Date;
  updatedAt: Date;
}

// --- 3. Mongoose Schema: Typed with the Document interface ---

/**
 * Mongoose Schema definition for the 'Like' collection.
 * It enforces that `_id` is a required Number, matching the `ILike` interface.
 */
export const ProjectLikeSchema = new Schema<IProjectLikeDocument>(
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
    timestamps: true, // Enables createdAt and updatedAt fields.
    _id: false,
  },
);

// --- 4. Mongoose Model: Apply hot-reloading pattern ---

// Define the model variable. The type is Model<ILikeDocument>.
let ProjectLikeModel: Model<IProjectLikeDocument>;

// Check if the model already exists to prevent Mongoose error in dev environments (Next.js hot reload).
if (mongoose.models.PortfolioProjectLike) {
  // Use existing model, asserting its type.
  ProjectLikeModel = mongoose.models.PortfolioProjectLike as Model<IProjectLikeDocument>;
} else {
  // Create the new model.
  ProjectLikeModel = mongoose.model<IProjectLikeDocument>(
    'PortfolioProjectLike',
    ProjectLikeSchema,
    'portfolio_project_likes',
  );
}

// Export the model for use.
export default ProjectLikeModel;
