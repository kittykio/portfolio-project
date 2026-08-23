'use server';

import BlogCollection, { IBlogLikeDocument } from '@/models/blogLikeModel';
import { PostType } from '@/types/PostType';
import connectToMongoDB from '@/lib/db';

type IdInput = { _id: number };
type LikeDocResult = IBlogLikeDocument | null;

/** Creates a zeroed reaction record for a locally discovered article. */
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

/** Returns `null` on database errors so content rendering can continue. */
export const searchLikeById = async ({ _id }: IdInput): Promise<LikeDocResult> => {
  try {
    return await BlogCollection.findById(_id);
  } catch (error) {
    console.error(`Error searching document with ID ${_id}. Error:`, error);
    return null;
  }
};

/** Always returns an array; unavailable reaction storage behaves like an empty collection. */
export const searchAllLike = async (
  params?: Partial<IBlogLikeDocument>,
): Promise<IBlogLikeDocument[]> => {
  try {
    return await BlogCollection.find(params || {});
  } catch (error) {
    console.error('Error searching all documents. Error:', error);
    return [];
  }
};

/** Removes a reaction record that no longer has a corresponding local article. */
export const deleteLike = async ({ _id }: IdInput): Promise<LikeDocResult> => {
  try {
    return await BlogCollection.findOneAndDelete({ _id });
  } catch (error) {
    console.error(`Failed to delete document with ID ${_id}. Error:`, error);
    return null;
  }
};

/**
 * Applies a bounded atomic increment. The bound prevents a delayed press from
 * producing an unexpectedly large reaction while retaining the hold interaction.
 */
export const updateLike = async ({
  _id,
  seconds,
}: {
  _id: number;
  seconds: number;
}): Promise<number> => {
  // Persistent reactions are optional; callers keep their optimistic local value without MongoDB.
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

    return updatedDoc.like ?? 0;
  } catch (error) {
    console.error(`Failed to update document with ID ${_id}. Error:`, error);
    return 0;
  }
};

/** Reconciles reaction records with the articles currently present on disk. */
export const buildLike = async (posts: PostType[]): Promise<void> => {
  try {
    const allDocs = await searchAllLike();

    // Build both sets before mutating so deletion and creation decisions use one snapshot.
    const dbIds = new Set(allDocs.map((doc) => doc._id));
    const postIds = new Set(posts.map((post) => post.id));

    const docsToDelete = allDocs.filter((doc) => !postIds.has(doc._id));

    if (docsToDelete.length > 0) {
      console.log(`Found ${docsToDelete.length} documents to delete.`);

      await Promise.all(docsToDelete.map((doc) => deleteLike({ _id: doc._id })));
    }

    const postsToCreate = posts.filter((post) => !dbIds.has(post.id));

    if (postsToCreate.length > 0) {
      console.log(`Found ${postsToCreate.length} posts to create.`);

      await Promise.all(postsToCreate.map((post) => createNewLike({ _id: post.id })));
    }

    console.log('Blog like collection build completed successfully.');
  } catch (error) {
    console.error(`Failed to build collection for Blog. Error:`, error);
  }
};
