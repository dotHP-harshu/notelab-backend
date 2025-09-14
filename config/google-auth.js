const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require("passport")
const userModel = require("../models/user.model")

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: `${process.env.CALLBACK_URL}`,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const { id, displayName, photos, emails } = profile;

        const user = await userModel.findOne({ googleId: id });

        if (!user) {
          const newUser = await userModel.create({
            googleId: id,
            name: displayName,
            email: emails[0].value,
            photo: photos[0].value,
          });
          console.log("user created");
          return cb(null, newUser);
        }
        return cb(null, user);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);