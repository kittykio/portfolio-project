'use server';

import ProjectCollection, { IProjectLikeDocument } from '@/models/projectLikeModel';
import { ProjectType } from '@/types/ProjectType';
import connectToMongoDB from '@/lib/db';

type IdInput = { _id: number };
type LikeDocResult = IProjectLikeDocument | null;

/** Creates a zeroed reaction record for a locally configured project. */
export const createNewLike = async ({ _id }: IdInput): Promise<LikeDocResult> => {
  try {
    return await ProjectCollection.create({
      _id,
      like: 0,
    });
  } catch (error) {
    console.error(`Failed to create document with ID ${_id}. Error:`, error);
    return null;
  }
};

/** Returns `null` on database errors so project content remains available. */
export const searchLikeById = async ({ _id }: IdInput): Promise<LikeDocResult> => {
  try {
    return await ProjectCollection.findById(_id);
  } catch (error) {
    console.error(`Error searching document with ID ${_id}. Error:`, error);
    return null;
  }
};

/** Always returns an array; unavailable reaction storage behaves like an empty collection. */
export const searchAllLike = async (
  params?: Partial<IProjectLikeDocument>,
): Promise<IProjectLikeDocument[]> => {
  try {
    return await ProjectCollection.find(params || {});
  } catch (error) {
    console.error('Error searching all documents. Error:', error);
    return [];
  }
};

/** Removes a reaction record that no longer has a corresponding local project. */
export const deleteLike = async ({ _id }: IdInput): Promise<LikeDocResult> => {
  try {
    return await ProjectCollection.findOneAndDelete({ _id });
  } catch (error) {
    console.error(`Failed to delete document with ID ${_id}. Error:`, error);
    return null;
  }
};

/** Applies the hold duration as a bounded, atomic reaction increment. */
export const updateLike = async ({
  _id,
  seconds,
}: {
  _id: number;
  seconds: number;
}): Promise<number> => {
  // A portfolio may be deployed without a reaction database. Keep content pages fast;
  // LikeButton falls back to a local optimistic count in that configuration.
  if (!process.env.MONGODB_URI) return 0;
  const increment = Math.min(Math.max(Math.floor(seconds), 1), 3);
  try {
    await connectToMongoDB();
    // `$inc` prevents concurrent reactions from overwriting each other.
    const updatedDoc = await ProjectCollection.findByIdAndUpdate(
      _id,
      { $inc: { like: increment } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    if (!updatedDoc) {
      console.warn(`Document with id ${_id} not found for update.`);
      return 0;
    }

    return updatedDoc.like ?? 0;
  } catch (error) {
    console.error(`Failed to update document with ID ${_id}. Error:`, error);
    return 0;
  }
};

/** Reconciles reaction records with the projects currently configured in source. */
export const buildLike = async (projects: ProjectType[]): Promise<void> => {
  try {
    const allDocs = await searchAllLike();

    // Build both sets before mutating so deletion and creation decisions use one snapshot.
    const dbIds = new Set(allDocs.map((doc) => doc._id));
    const projectIds = new Set(projects.map((project) => project.id));

    const docsToDelete = allDocs.filter((doc) => !projectIds.has(doc._id));

    if (docsToDelete.length > 0) {
      console.log(`Found ${docsToDelete.length} documents to delete.`);

      await Promise.all(docsToDelete.map((doc) => deleteLike({ _id: doc._id })));
    }

    const projectsToCreate = projects.filter((project) => !dbIds.has(project.id));

    if (projectsToCreate.length > 0) {
      console.log(`Found ${projectsToCreate.length} projects to create.`);

      await Promise.all(projectsToCreate.map((project) => createNewLike({ _id: project.id })));
    }

    console.log('Project like collection build completed successfully.');
  } catch (error) {
    console.error(`Failed to build collection for project. Error:`, error);
  }
};
