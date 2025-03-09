const AWS = require("aws-sdk");
const dotenv = require("dotenv");

// Load .env for local development
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

// Common function to get secrets
const getSecrets = async () => {
    if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging") {
        const secretsManager = new AWS.SecretsManager({ region: "ap-south-1" });

        try {
            console.log("Fetching secrets from AWS Secrets Manager...");
            const secretData = await secretsManager.getSecretValue({ SecretId: "cms_secrets" }).promise();
            const secrets = JSON.parse(secretData.SecretString);

            // Merge AWS secrets into process.env
            process.env = { ...process.env, ...secrets };
            console.log("Secrets loaded successfully.");
        } catch (error) {
            console.error("❌ Error fetching secrets:", error);
        }
    } else {
        console.log("Using local .env configuration.");
    }
};

// Immediately fetch secrets when this module is loaded
getSecrets();

module.exports = getSecrets;
