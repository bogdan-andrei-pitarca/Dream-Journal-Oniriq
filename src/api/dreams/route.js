const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createDream, getDreams, updateDream, deleteDream } = require("./controller");

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024 * 1024, // 20GB limit
    },
});

// CRUD Routes
router.post("/", createDream); // Create a new dream
router.get("/", getDreams); // Get all dreams with filtering and sorting
router.patch("/:id", updateDream); // Update a dream by ID (changed from PUT to PATCH)
router.delete("/:id", deleteDream); // Delete a dream by ID

// File upload endpoint
router.post("/upload", upload.single("file"), (req, res) => {
    const { entityId } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Add file metadata to the response
    const fileData = {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        type: req.file.mimetype,
    };

    res.json(fileData);
});

module.exports = router;