const {POST} = require("../models/postModel"); // Assuming you have a Mongoose model

const getPost = async () => {
  try {
    return await POST.find({}); // Fetch all posts from MongoDB
  } catch (error) {
    console.error("Error in postQuery:", error);
    throw error; // Rethrow the error to be caught in the service layer
  }
};

// Function to create a new post in the database
const createPost = async (postData) => {
  try {
    // Create and save the new post
    const newPost = await POST.create(postData);
    return newPost;
  } catch (error) {
    console.error('Error in createPost query:', error);
    throw error; // Rethrow the error to be caught in the service/controller
  }
};



module.exports = {
  getPost,
  createPost
};
