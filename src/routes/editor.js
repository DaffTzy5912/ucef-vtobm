const express = require("express");
const router = express.Router();
const ffmpeg = require("fluent-ffmpeg");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Setup storage for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../uploads/input");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.fields([{ name: "media" }, { name: "audio" }]), async (req, res) => {
  try {
    const mediaPath = req.files.media[0].path;
    const audioPath = req.files.audio ? req.files.audio[0].path : null;
    const duration = parseInt(req.body.duration) || 5;

    const outputDir = path.join(__dirname, "../../uploads/output");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, "output.mp4");
    const outputUrl = `/output/output.mp4`;

    let command = ffmpeg();

    // Jika file berupa foto
    if (req.files.media[0].mimetype.startsWith("image")) {
      command.input(mediaPath).inputFormat("image2").fps(30).duration(duration);
    } else {
      command.input(mediaPath);
    }

    // Jika ada backsound
    if (audioPath) {
      command.input(audioPath).audioCodec("aac");
    }

    command
      .videoCodec("libx264")
      .on("end", () => {
        res.json({ outputUrl });
      })
      .on("error", (err) => {
        res.status(500).json({ error: err.message });
      })
      .save(outputPath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve output files
router.use("/output", express.static(path.join(__dirname, "../../uploads/output")));

module.exports = router;
