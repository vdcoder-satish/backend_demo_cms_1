
require('../dbConfig/getConfig')
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

// Validate required env variables
if (!process.env.S3_BUCKET_NAME || !process.env.AWS_REGION) {
  throw new Error("Missing required environment variables for S3");
}

// Configure AWS S3 (Uses IAM role if running on AWS)
const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
});

// Set up Multer-S3 for direct streaming
const uploadFile = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    key: (req, file, cb) => {
      const fileName = `cms/${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
      cb(null, fileName);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE, // Auto-detect file type
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'), false);
  },
}).single('image');

// Function to manually upload a file (if needed)
const uploadFileToS3 = async (file) => {
  try {
    if (!file) throw new Error("No file provided");

    const fileName = `cms/${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error(`Error uploading to S3: ${error.message}`);
  }
};

module.exports = { uploadFile, uploadFileToS3 };
