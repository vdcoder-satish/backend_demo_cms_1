const  postQuery  = require("../queries/postQuery");

const getPost = async () => {
  try {
    return await postQuery.getPost();
  } catch (error) {
    console.error("Error in postService:", error);
    throw error; // Rethrow the error to be caught in the controller
  }
};

const createPost = async (postData) => {
  try {
    console.log('ia mi in service',postData)
    // Call query layer to create the post
    const result = await postQuery.createPost(postData);
    return result;
  } catch (error) {
    console.error("Error in postService:", error);
    throw error; // Rethrow the error to be caught in the controller
  }
};



module.exports = {
  getPost,
  createPost
};
