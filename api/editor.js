const express = require("express");
const serverless = require("serverless-http");
const ffmpeg = require("fluent-ffmpeg");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const os = require("os");

// Install FFmpeg in Vercel environment
try {
  const installFFmpeg = require('./_lib/install-ffmpeg');
  const ffmpegPath = installFFmpeg();
  // Tell fluent-ffmpeg where to find the ffmpeg executable
  ffmpeg.setFfmpegPath(path.join(ffmpegPath, 'ffmpeg'));
} catch (error) {
  console.error('Failed to install FFmpeg:', error);
  // We'll continue and let the error happen when ffmpeg is actually used
}
