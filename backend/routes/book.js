const express = require("express");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const optimizeImage = require("../middleware/sharp");
const router = express.Router();

const bookCtrl = require("../controllers/book");

router.post("/", auth, multer, optimizeImage, bookCtrl.createBook);
router.get("/bestrating", bookCtrl.bestRatingBooks);
router.get("/", bookCtrl.getAllBooks);
router.post("/:id/rating", auth, bookCtrl.rateBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.put("/:id", auth, multer, optimizeImage, bookCtrl.modifyBook);
router.get("/:id", bookCtrl.getOneBook);

module.exports = router;
