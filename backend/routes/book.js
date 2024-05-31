const express = require("express");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

const router = express.Router();

const bookCtrl = require("../controllers/book");

router.post("/", auth, multer, bookCtrl.createBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.get("/:id", bookCtrl.getOneBook);
// router.get("//bestrating",auth ,  bookCtrl.bestRatingBooks);
router.get("/", bookCtrl.getAllBooks);

module.exports = router;
