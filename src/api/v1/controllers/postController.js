const  postService  = require("../services/postService");
const { uploadFile, uploadFileToS3 } = require('../../../utility/fileUpload');
const getPost = async (req, res) => {
  try {
    const result = await postService.getPost();
    res.status(200).json({ message: "Successful", result });
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



const createPost = async (req, res) => {
  try {
    // First, handle file upload
    uploadFile(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'File upload failed', error: err.message });
      }

      const postData = req.body;
      let imagePath = null;

      // If a file was uploaded, upload to S3 and get the URL
      if (req.file) {
        imagePath = await uploadFileToS3(req.file); // Get the S3 file URL
        postData.image = imagePath; // Add the image URL to the post data
      }

      // Now create the post using the service
      const newPost = await postService.createPost(postData);

      // Return the created post as a response
      res.status(201).json({
        message: 'Post created successfully',
        post: newPost,
      });
    });
  } catch (error) {
    console.error('Error in controller:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};


module.exports = {
  createPost,
  getPost,
};
