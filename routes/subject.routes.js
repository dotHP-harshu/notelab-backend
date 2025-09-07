const router = require("express").Router()
const {
  addSubject,
  getSubjects,
  updateSubject,
  deleteSubject,
  getSubjectsList,
  getOneSubject,
  querySearch,
} = require("../controllers/subject");
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const upload = multer();

router.post("/add",  upload.single("file"), addSubject  )
router.get("/get", authMiddleware, getSubjects);
router.get("/get/:id", authMiddleware, getOneSubject);
router.get("/getList", authMiddleware, getSubjectsList);
router.put("/update/:id", authMiddleware, updateSubject);
router.delete("/delete/:id", authMiddleware, deleteSubject);
router.get("/search", authMiddleware, querySearch);

module.exports = router