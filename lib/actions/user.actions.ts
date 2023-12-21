"use server";

import { FilterQuery, Model, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { currentUser } from "@clerk/nextjs";
import { connectToDB } from "../mongoose";

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId })
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function Usernumber(pageNumber = 1, pageSize = 20) {
  connectToDB();
  const totalUserCount = await User.countDocuments(); // Get the total count of posts

  return {totalUserCount};
}


interface Params {
  userId: string;
  lastname: string;
  firstname: string;
  path: string;
  communitie: string;
}
interface CommunityEmailDomains {
  [key: string]: string;
}

const communityEmailDomains: CommunityEmailDomains = {
  communitie1: "ipsa.fr",
  // Ajoutez d'autres communautés si nécessaire
};

export async function updateUser({
  userId,
  lastname,
  firstname,
  path,
  communitie,
}: Params): Promise<void> {
  try {
    connectToDB();

    const user = await currentUser();
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      throw new Error('User email address not found');
    }

    // Utilisez la première adresse e-mail de l'utilisateur
    const emailAddress = user.emailAddresses[0].emailAddress;
    const emailDomain = emailAddress.split('@')[1];
    if (communitie in communityEmailDomains && emailDomain !== communityEmailDomains[communitie]) {
      throw new Error(`Votre adresse e-mail n'appartient pas à l'école sélectionnée (${communityEmailDomains[communitie]}).`);
    }

    await User.findOneAndUpdate(
      { id: userId },
      {
        lastname,
        firstname,
        communitie,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`User Error: ${error.message}`);
  }
}


// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}
