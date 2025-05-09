const cors = require("cors");

const corsOptions = {
    origin: "http://localhost:3000", // Frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
};

module.exports = cors(corsOptions);