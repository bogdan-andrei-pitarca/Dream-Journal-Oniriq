const express = require("express");
const cors = require("./config/cors");
const dreamsRouter = require("./api/dreams/route");
const statisticsRouter = require("./api/statistics/routes");
const WebSocket = require('ws');
const http = require('http');
const sequelize = require('./config/database');
const { Dream, Tag } = require('./models/associations');

const app = express();
const PORT = 5000;

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');

    // Send initial data
    const sendInitialData = async () => {
        try {
            // You can implement this function to get initial data
            const initialData = { type: 'initial', data: [] };
            ws.send(JSON.stringify(initialData));
        } catch (error) {
            console.error('Error sending initial data:', error);
        }
    };

    sendInitialData();

    // Handle incoming messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received:', data);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Broadcast to all connected clients
const broadcast = (data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// Make broadcast available globally
global.wsBroadcast = broadcast;

// Enable CORS
app.use(cors);

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running!" });
});

// Use the dreams router for /api/dreams
app.use("/api/dreams", dreamsRouter);

// Use the statistics router for /api/statistics
app.use("/api/statistics", statisticsRouter);

// Initialize database and start server
async function startServer() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Drop existing tables if they exist
        await sequelize.query('DROP TABLE IF EXISTS "DreamTags" CASCADE');
        await sequelize.query('DROP TABLE IF EXISTS "Dreams" CASCADE');
        await sequelize.query('DROP TABLE IF EXISTS "Tags" CASCADE');
        console.log('Cleaned up existing tables.');

        // Sync models with database
        await sequelize.sync({ force: false });
        console.log('Database models synchronized successfully.');

        // Start the server
        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`WebSocket server is running on ws://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to start server:', error);
        console.error('Error details:', error.original || error);
        process.exit(1);
    }
}

// Start the server
startServer();