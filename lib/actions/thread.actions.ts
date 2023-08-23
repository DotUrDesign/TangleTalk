"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"

interface Params {
    text : string,
    author : string,
    communityId : string | null,
    path : string
}

export async function createThread({text, author, communityId, path} : Params) {

    try{
        connectToDB();
    
        const createdThread = await Thread.create({
            text,
            author,
            // community: communityId,
            community: null,
        });
    
        // Update user model 
        await User.findByIdAndUpdate(author, {
            $push: { threads : createdThread._id }  
        })
    
        revalidatePath(path);
    }
    catch(error : any){
        throw new Error(`Error creating thread: ${error.message}`);
    }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
    connectToDB();

    // Calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch the posts that have no parents in the thread collection --> top-level threads
    const postsQuery = Thread.find({parentId : {$in : [null, undefined]}})

        .sort({ createdAt: 'desc'})  // Sort the results in the descending order, so the most recent threads come first.

        .skip(skipAmount) // Helps you skip a certain number of threads --> used for pagination

        .limit(pageSize)  // restricts the number of threads returned in a single query --> used for pagination

        // The .populate method is used to replace a reference ID in a field with the actual data from a referenced collection.
        .populate({ path : 'author', model : User}) // The first ".populate" populated the "author" field in the fetched threads with details from the "User" collection. This means you will get the user information(like their name) instead of just an ID.

        .populate({
                path : 'children',
                populate: {
                    path : 'author',
                    model: User,
                    select : "_id name parentId image"
                }
        })  // The second ".populate" is populating the "children" field of the fetched threads. It further populates the "author" field within the children threads with selected fields like "_id", "name", "parentId", and "image".

        // calculating the total posts count...
        const totalPostsCount = await Thread.countDocuments({ parentId : {$in : [null, undefined]}});

        const posts = await postsQuery.exec();

        const isNext = totalPostsCount > skipAmount + posts.length; // if there are more posts to show on the next page, the variable isNext will store a value "true" or it will store a value "false".

        return { posts , isNext };
}

export async function fetchThreadById(threadId: string) {
    connectToDB();
  
    try {
      const thread = await Thread.findById(threadId)
        .populate({
          path: "author",
          model: User,
          select: "_id id name image",
        }) // Populate the author field with _id and username
        // .populate({
        //   path: "community",
        //   model: Community,
        //   select: "_id id name image",
        // }) // Populate the community field with _id and name
        .populate({
          path: "children", // Populate the children field
          populate: [
            {
              path: "author", // Populate the author field within children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
            {
              path: "children", // Populate the children field within children
              model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
              populate: {
                path: "author", // Populate the author field within nested children
                model: User,
                select: "_id id name parentId image", // Select only _id and username fields of the author
              },
            },
          ],
        })
        .exec();  // execute on this specific query
  
      return thread;
    } catch (err) {
      console.error("Error while fetching thread:", err);
      throw new Error("Unable to fetch thread");
    }
  }


  export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string
  ) {
    connectToDB();
  
    try {
      // Find the original thread by its ID
      const originalThread = await Thread.findById(threadId);
  
      if (!originalThread) {
        throw new Error("Thread not found");
      }
  
      // Create the new comment thread
      const commentThread = new Thread({
        text: commentText,
        author: userId,
        parentId: threadId, // Set the parentId to the original thread's ID
      });
  
      // Save the comment thread to the database
      const savedCommentThread = await commentThread.save();
  
      // Add the comment thread's ID to the original thread's children array
      originalThread.children.push(savedCommentThread._id);
  
      // Save the updated original thread to the database
      await originalThread.save();
  
      revalidatePath(path);
    } catch (err) {
      console.error("Error while adding comment:", err);
      throw new Error("Unable to add comment");
    }
  }