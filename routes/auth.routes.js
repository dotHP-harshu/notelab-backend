const passport = require("passport");
const { googleCallback, getUser, logoutUser } = require("../controllers/auth");
const authMiddelware = require("../middleware/auth")

const router = require("express").Router()

router.get("/google", passport.authenticate("google", {scope:["profile", "email" ]}))
router.get("/get-user",authMiddelware, getUser)
router.get("/logout", logoutUser)

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/google",
    
  }),googleCallback
);



module.exports = router