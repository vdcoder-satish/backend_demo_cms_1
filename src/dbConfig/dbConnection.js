

const AWS = require('aws-sdk');
const mongoose = require('mongoose');
require('dotenv').config(); // Loads .env in local development

const secretsManager = new AWS.SecretsManager({ region: 'ap-south-1' });

// Function to get secrets from AWS or use local .env
const loadSecrets = async () => {
  if (process.env.NODE_ENV === 'development') {
    // If running locally, use .env file
    return {
      MONGO_URI: process.env.MONGO_URI,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    };
  } else {
    // If running in AWS, fetch from Secrets Manager
    try {
      const data = await secretsManager.getSecretValue({ SecretId: 'cms_secrets' }).promise();
      const secrets = JSON.parse(data.SecretString);
      
      // Set secrets as environment variables
      process.env.MONGO_URI = secrets.MONGO_URI;
      process.env.AWS_ACCESS_KEY_ID = secrets.AWS_ACCESS_KEY_ID;
      process.env.AWS_SECRET_ACCESS_KEY = secrets.AWS_SECRET_ACCESS_KEY;

      return secrets;
    } catch (error) {
      console.error('❌ Error fetching secrets:', error);
      process.exit(1); // Exit if secrets can't be loaded
    }
  }
};

// Function to connect to MongoDB
const getConnection = async (retries = 5, delay = 3000) => {
  try {
    const secrets = await loadSecrets(); // Load secrets dynamically

    await mongoose.connect(secrets.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 60000,
    });

    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ Error Connecting to MongoDB:", error.message);

    if (retries > 0) {
      console.log(`🔄 Retrying in ${delay / 1000} seconds... (${retries} attempts left)`);
      setTimeout(() => getConnection(retries - 1, delay), delay);
    } else {
      console.error("Maximum retry attempts reached. Exiting...");
      process.exit(1);
    }
  }
};

module.exports = { getConnection };
