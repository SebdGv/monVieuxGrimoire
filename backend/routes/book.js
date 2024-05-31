const express = require("express");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const uploadAndOptimizeImage = require("../middleware/multer-config");
const router = express.Router();

const bookCtrl = require("../controllers/book");

router.post("/", auth, uploadAndOptimizeImage, bookCtrl.createBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.put("/:id", auth, uploadAndOptimizeImage, bookCtrl.modifyBook);
router.get("/:id", bookCtrl.getOneBook);
// router.get("//bestrating",auth ,  bookCtrl.bestRatingBooks);
router.get("/", bookCtrl.getAllBooks);

module.exports = router;
