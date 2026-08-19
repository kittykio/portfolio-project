'use server';

import BlogCollection, { IBlogLikeDocument } from '@/models/blogLikeModel';
import { PostType } from '@/types/PostType';
import connectToMongoDB from '@/lib/db';

// --- Type Definitions for Consistency ---
type IdInput = { _id: number };
type LikeDocResult = IBlogLikeDocument | null;

// --- Database Operations (Type-Safe & Consistent Returns) ---

/**
 * Create a new document.
 */
export const createNewLike = async ({ _id }: IdInput): Promise<LikeDocResult> => {
  try {
    return await BlogCollection.create({
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
    return await BlogCollection.findById(_id);
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
  params?: Partial<IBlogLikeDocument>,
): Promise<IBlogLikeDocument[]> => {
  try {
    return await BlogCollection.find(params || {});
  } catch (error) {
    console.error('Error searching all documents. Error:', error);
    // Return empty array on failure for safer list processing
    return [];
  }
};

/**
 * Search the given document and deletes it.
 */
export const deleteLike = async ({ _id }: IdInput): Promise<LikeDocResult> => {
  try {
    return await BlogCollection.findOneAndDelete({ _id });
  } catch (error) {
    console.error(`Failed to delete document with ID ${_id}. Error:`, error);
    return null;
  }
};

/**
 * Searches the given document and updates its like field atomically.
 */
export const updateLike = async ({
  _id,
  seconds,
}: {
  _id: number;
  seconds: number;
}): Promise<number> => {
  if (!process.env.MONGODB_URI) return 0;
  const increment = Math.min(Math.max(Math.floor(seconds), 1), 3);
  try {
    await connectToMongoDB();
    const updatedDoc = await BlogCollection.findByIdAndUpdate(
      _id,
      { $inc: { like: increment } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    if (!updatedDoc) {
      console.warn(`Document with id ${_id} not found for update.`);
      return 0;
    }

    // Return the new like count
    return updatedDoc.like ?? 0;
  } catch (error) {
    console.error(`Failed to update document with ID ${_id}. Error:`, error);
    return 0;
  }
};

export const buildLike = async (posts: PostType[]): Promise<void> => {
  try {
    const allDocs = await searchAllLike();

    // Create Sets for fast O(1) lookups: much cleaner than filtering arrays twice
    const dbIds = new Set(allDocs.map((doc) => doc._id));
    const postIds = new Set(posts.map((post) => post.id));

    // 1. Identify and Delete Removed Posts
    // Find documents in DB that are NOT in the current post list
    const docsToDelete = allDocs.filter((doc) => !postIds.has(doc._id));

    if (docsToDelete.length > 0) {
      console.log(`Found ${docsToDelete.length} documents to delete.`);

      // 💡 FIX: Use Promise.all to await all asynchronous deletions concurrently
      await Promise.all(docsToDelete.map((doc) => deleteLike({ _id: doc._id })));
    }

    // 2. Identify and Create New Posts
    // Find posts in the list that are NOT in the DB
    const postsToCreate = posts.filter((post) => !dbIds.has(post.id));

    if (postsToCreate.length > 0) {
      console.log(`Found ${postsToCreate.length} posts to create.`);

      // 💡 FIX: Use Promise.all to await all creations concurrently
      await Promise.all(postsToCreate.map((post) => createNewLike({ _id: post.id })));
    }

    console.log('Blog like collection build completed successfully.');
  } catch (error) {
    console.error(`Failed to build collection for Blog. Error:`, error);
  }
};
