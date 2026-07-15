const express = require("express");
const musicController = require("../controllers/music.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
const multer = require("multer");

const upload = multer({
    storage: multer.memoryStorage(),
})

const router = express.Router();

router.post("/upload", authMiddleware.authArtist, upload.single("music"), musicController.createMusic); 
router.post("/album", authMiddleware.authArtist, musicController.createAlbum);
router.get("/", authMiddleware.authMusic, musicController.getMusic);
router.get("/albums", authMiddleware.authMusic, musicController.getAlbum);

module.exports = router;