"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}
  

// lets first make a connection to the mongoose
export async function updateUser(
    {userId,
    username,
    name ,
    bio ,
    image ,
    path} : Params
    ): Promise<void> {
    try
    {
        connectToDB();

        await User.findOneAndUpdate(
            { id: userId },
            {
            username: username.toLowerCase(),
            name,
            bio,
            image,
            onboarded: true,
            },
            { upsert: true }  // upsert --> update + insert --> It is a database operation that will update an existing row if a specified value already exists in a table, and insert a new row if the specified value doesn't already exist.
        );

        if (path === "/profile/edit") {
            revalidatePath(path);  // revalidatePath allows you to revalidate data associated with a specific path. This is useful for scenarios where you want to update your cached data without waiting for a revalidation period to expire.
        }
    }
    catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
      }
}

export async function fetchUser(userId: string) {
    try {
        connectToDB();

        return await User
        .findOne({ id : userId })
        // .populate({
        //     path: 'communities',
        //     model: Community
        // })
    }
    catch(error : any){
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}