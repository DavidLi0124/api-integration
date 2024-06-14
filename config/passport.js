const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const bcrypt = require("bcrypt");

const { User } = require("../models/User");

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      User.findOne({
        googleId: profile.id,
      })
        .then(async (user) => {
          if (!user) {
            const newPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user = new User({
              googleId: profile.id,
              email: profile.emails[0].value,
              password: hashedPassword,
              isVerified: profile.emails[0].verified,
            });
            user
              .save()
              .then(() => {
                return done(null, user);
              })
              .catch((err) => {
                return done(err);
              });
          } else {
            return done(null, user);
          }
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

module.exports = passport;
