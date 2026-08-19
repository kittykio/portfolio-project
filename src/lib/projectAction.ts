'use server';

import ProjectCollection, { IProjectLikeDocument } from '@/models/projectLikeModel';
import { ProjectType } from '@/types/ProjectType';
import connectToMongoDB from '@/lib/db';

// --- Type Definitions for Consistency ---
type IdInput = { _id: number };
type LikeDocResult = IProjectLikeDocument | null;

// --- Database Operations (Type-Safe & Consistent Returns) ---

/**
 * Creates a new document with like count initialized to 0.
 */
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

/**
 * Search a single document by its _id field.
 */
export const searchLikeById = async ({ _id }: IdInput): Promise<LikeDocResult> => {
  try {
    // Mongoose findById returns the document or null
    return await ProjectCollection.findById(_id);
  } catch (error) {
    console.error(`Error searching document with ID ${_id}. Error:`, error);
    return null;
  }
};

/**
 * Search a list of documents that match filter.
 * Guaranteed to return an array, empty if no documents found or on error.
 */
export const searchAllLike = async (
  params?: Partial<IProjectLikeDocument>,
): Promise<IProjectLikeDocument[]> => {
  try {
    // Return empty array if no documents found or on error
    return await ProjectCollection.find(params || {});
  } catch (error) {
    console.error('Error searching all documents. Error:', error);
    return [];
  }
};

/**
 * Search the given document and deletes it.
 */
export const deleteLike = async ({ _id }: IdInput): Promise<LikeDocResult> => {
  try {
    // findOneAndDelete returns the deleted document or null
    return await ProjectCollection.findOneAndDelete({ _id });
  } catch (error) {
    console.error(`Failed to delete document with ID ${_id}. Error:`, error);
    return null;
  }
};

/**
 * Updates the document's like field atomically.
 */
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
    // Use $inc for atomic update, which is safer and often faster than find + update
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

// --- Synchronization Logic (buildLike) ---

/**
 * Synchronizes the database collection with the local projects.
 * Creates new documents for missing projects and deletes documents for removed projects.
 *
 * @param projects Fetched projects from local.
 * @returns A promise that resolves when the build is successful.
 * @async
 */
export const buildLike = async (projects: ProjectType[]): Promise<void> => {
  try {
    // searchAllLike now guarantees an array, avoiding null/undefined checks
    const allDocs = await searchAllLike();

    // Create Sets for fast O(1) lookups: better than array iteration
    const dbIds = new Set(allDocs.map((doc) => doc._id));
    const projectIds = new Set(projects.map((project) => project.id));

    // 1. Identify and Delete Removed Projects
    // Find documents in DB that are NOT in the current project list
    const docsToDelete = allDocs.filter((doc) => !projectIds.has(doc._id));

    if (docsToDelete.length > 0) {
      console.log(`Found ${docsToDelete.length} documents to delete.`);

      // Use Promise.all to await all asynchronous deletions concurrently
      await Promise.all(docsToDelete.map((doc) => deleteLike({ _id: doc._id })));
    }

    // 2. Identify and Create New Projects
    // Find projects in the list that are NOT in the DB
    const projectsToCreate = projects.filter((project) => !dbIds.has(project.id));

    if (projectsToCreate.length > 0) {
      console.log(`Found ${projectsToCreate.length} projects to create.`);

      // Use Promise.all to await all asynchronous creations concurrently
      await Promise.all(projectsToCreate.map((project) => createNewLike({ _id: project.id })));
    }

    console.log('Project like collection build completed successfully.');
  } catch (error) {
    // Catch any remaining unexpected errors
    console.error(`Failed to build collection for project. Error:`, error);
  }
};
