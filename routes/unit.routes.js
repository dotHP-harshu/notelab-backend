const { addUnit, getUnits, deleteUnit, updateUnit , getUrl } = require("../controllers/unit");

const router = require("express").Router();
const multer = require("multer")
const upload = multer()

router.post("/add/:subjectId",upload.single("file"), addUnit)
router.get("/:subjectId", getUnits )
router.get("/url/:id", getUrl )
router.delete("/delete/:id", deleteUnit )
router.post("/update/:id", updateUnit )

module.exports = router