
const express = require('express');
const awsServerlessExpress = require('aws-serverless-express');
require('dotenv').config();
require("./src/dbConfig/getConfig")
const rootRoute = require('./src/api/v1/routes/index');
const { getConnection } = require('./src/dbConfig/dbConnection');

const app = express();
app.use(express.json());

// Initialize DB before starting the server
getConnection().then(() => console.log("✅ Database connected.")).catch(console.error);

// Routing
app.use('/api', rootRoute);

// AWS Lambda Handler
const server = awsServerlessExpress.createServer(app);

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false; // Prevent Lambda from freezing
    return awsServerlessExpress.proxy(server, event, context);
};

// Local Development Mode
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`🚀 Server running locally on http://localhost:${port}`);
    });
}
