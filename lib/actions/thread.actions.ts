"use server";

import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import Matiere from "../models/matiere.model";

export async function fetchPosts(pageNumber = 1, pageSize = 4) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
  const postsQuery = Thread.find()
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize);

  // Count the total number of top-level posts (threads) i.e., threads that are not comments.
  const totalPostsCount = await Thread.countDocuments(); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext, totalPostsCount};
}

export async function fetchNewClass(pageNumber = 1, pageSize = 4) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level threads) (a thread that is not a comment/reply).
  const postsQuery = Matiere.find()
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize);

  // Count the total number of top-level posts (threads) i.e., threads that are not comments.
  const totalMatCount = await Matiere.countDocuments(); // Get the total count of posts

  const matiere = await postsQuery.exec();

  const isNext = totalMatCount > skipAmount + matiere.length;

  return { matiere, isNext, totalMatCount};
}


export async function fetchDocbyId(id : string) {
  connectToDB();

  
  const doc = await Thread.find({id});
  const document = await doc[0];
  return document;
}

export async function fetchDocbyClass(matiere : string) {
  connectToDB();

  // Récupère toutes les matières pour un niveau spécifique
  const doc = await Thread.find({matiere: matiere});
  return doc;
}


export async function fetchClass(niveau : string) {
  connectToDB();

  // Récupère toutes les matières pour un niveau spécifique
  const matieres = await Matiere.find({ niveau: niveau });

  return matieres;
}

export async function fetchClassbyID(id : string) {
  connectToDB();

  // Récupère toutes les matières pour un niveau spécifique
  const matiere = await Matiere.find({ id: id });
  const mat = await matiere[0];

  return mat;
}

export async function fetchlike(id: string, userId: string) {
  connectToDB();

  const result = await Thread.aggregate([
    { $match: { id: id } },
    { $project: { numberOfLikes: { $size: "$likes" } } }
  ]);

  const userliked = await Thread.aggregate([
    { $match: { id: id } },
    { $project: { userLiked: { $in: [userId, "$likes"] } } }
    ]);
  
  const totalLikeCount = result.length > 0 ? result[0].numberOfLikes : 0;
  const userLiked = userliked.length > 0 ? userliked[0].userLiked : false;

  
  return {totalLikeCount, userLiked};
}

interface Params {
  text: string;
  author: string;
  authorId: string;
  communityId: string;
  document: string; 
  title: string;
  niveau: string;
  matiere: string;
}

interface Params2 {
  text: string;
  author: string;
  communityId: string;
  title: string;
  niveau: string;
  codematiere: string;
}

async function canCreateClass(author: string) {
  const oneMinuteAgo = new Date(Date.now() - 30 * 1000); // 30 secondes avant maintenant

  const recentMatiere = await Matiere.findOne({
    author: author,
    createdAt: { $gte: oneMinuteAgo }
  }).exec();

  return !recentMatiere; // Retourne vrai si aucune matière récente n'a été trouvée
}

export async function createClass({ text, author, communityId, title, niveau, codematiere}: Params2) {
  try {
    connectToDB();

    // Vérifiez si l'utilisateur peut créer une nouvelle matière
    if (!await canCreateClass(author)) {
      throw new Error("Vous ne pouvez créer qu'une matière par 30 secondes.");
    }

    await Matiere.create({
      text: text,
      author: author,
      communitie: communityId,
      niveau: niveau,
      title: title,
      codematiere: codematiere,
    });
  } catch (error: any) {
    throw new Error(`Failed to create matiere: ${error.message}`);
  }
}

async function canCreateThread(authorId: string) {
  const oneMinuteAgo = new Date(Date.now() - 20 * 1000); // 20 secondes avant maintenant

  const recentMatiere = await Thread.findOne({
    authorId: authorId,
    createdAt: { $gte: oneMinuteAgo }
  }).exec();

  return !recentMatiere; // Retourne vrai si aucun Post récent n'a été trouvée
}

export async function createThread({text, author, authorId, communityId, document, title, niveau, matiere }: Params) {
  try {
    connectToDB();

    // Vérifiez si l'utilisateur peut créer une nouvelle matière
    if (!await canCreateThread(authorId)) {
      throw new Error("Vous ne pouver ajouter qu'un document par 20 Secondes.");
    }

    await Thread.create({
      text: text,
      author: author,
      authorId: authorId,
      communitie: communityId, // Assign communityId if provided, or leave it null for personal account
      document: document, // Stocker le lien du document
      title: title,
      niveau: niveau,
      matiere: matiere,
    });
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}


export async function updateDoc(id: string, userId :string) {
  try {
    connectToDB();

    await Thread.findOneAndUpdate(
      { id: id },
      { $addToSet: { likes: userId } },
      { new: true}
    );
  } catch (error: any) {
    throw new Error(`User Error: ${error.message}`);
  }
}

export async function deleteThread(id: string) {
  try {
    connectToDB();

    const doctodel = await Thread.find({id});

    if (!doctodel) {
      throw new Error("Document not found");
    }

    // Recursively delete child threads and their descendants
    await Thread.deleteOne({id});

  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}
