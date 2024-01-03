const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user");

passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        console.log("Hi, user", user);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  ),

  passport.serializeUser((user, done) => {
    console.log("A user", user)
    done(null, user.id);
  }),

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      console.log("des User", user);
      done(null, user);
    } catch (err) {
      done(err);
    }
  }),
  passport.authenticate("local", {
    failureRedirect: "/board/user/sign-in",
    failureMessage: true,
  })

module.exports = passport;