const { addUnit, getUnits, deleteUnit, updateUnit , getUrl } = require("../controllers/unit");

const router = require("express").Router();
const multer = require("multer");
const authMiddleware = require("../middleware/auth");
const upload = multer();

router.post("/add/:subjectId", upload.single("file"), addUnit);
router.get("/:subjectId", authMiddleware, getUnits);
router.get("/url/:id", authMiddleware, getUrl);
router.delete("/delete/:id", deleteUnit )
router.post("/update/:id", updateUnit )

module.exports = router