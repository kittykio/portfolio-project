import mongoose, { Schema, Model } from 'mongoose';

/** Reaction totals use the stable numeric ID derived from a project name. */
export interface IProjectLike {
  _id: number;
  like: number;
}

export interface IProjectLikeDocument extends IProjectLike {
  createdAt: Date;
  updatedAt: Date;
}

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
    timestamps: true,
    _id: false,
  },
);

let ProjectLikeModel: Model<IProjectLikeDocument>;

// Reuse the registered model during Next.js hot reloads to avoid OverwriteModelError.
if (mongoose.models.PortfolioProjectLike) {
  ProjectLikeModel = mongoose.models.PortfolioProjectLike as Model<IProjectLikeDocument>;
} else {
  ProjectLikeModel = mongoose.model<IProjectLikeDocument>(
    'PortfolioProjectLike',
    ProjectLikeSchema,
    'portfolio_project_likes',
  );
}

export default ProjectLikeModel;
