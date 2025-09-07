const { addBookmark, getBookmarks } = require("../controllers/bookmark");
const authMiddleware = require("../middleware/auth");

const router = require("express").Router()

router.post("/add/:subjectId",authMiddleware, addBookmark)
router.get("/get/:userId", authMiddleware, getBookmarks)


module.exports = router;