const User = require("../models/user");
const Message = require("../models/message");
const passport = require("passport");
// const LocalStrategy = require("passport-local");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Users.
exports.user_list = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find(
    {},
    "username first_name family_name membership"
  )
    .sort({ username: 1 })
    .exec();

  res.render("user_list", {
    title: "User List",
    user_list: allUsers,
  });
});

// Display detail page for a specific User.
exports.user_detail = asyncHandler(async (req, res, next) => {
  // Get details of user and all their messages (in parallel)
  const [user, allMessagesByUser] = await Promise.all([
    User.findById(req.params.id).exec(),
    Message.find({ user: req.params.id }, "title text timestamp").exec(),
  ]);

  if (user === null) {
    // No results.
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  res.render("user_detail", {
    title: "User Detail",
    user: user,
    user_messages: allMessagesByUser,
  });
});

// Display User sign up form on GET.
exports.user_sign_up_get = (req, res, next) => {
  res.render("new_user_form", { title: "Sign Up Form" });
};

// Handle User sign up on POST.
exports.user_sign_up_post = [
  // Validate and sanitize fields.
  body("username")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters long.")
    .isAlphanumeric()
    .withMessage("Username has non-alphanumeric characters.")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .escape(),
  body("first_name").trim().isLength({ min: 1 }).escape(),
  body("family_name").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Users object with escaped and trimmed data
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      membership: "base",
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("new_user_form", {
        title: "Sign Up Form",
        user: user,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save user.
      await user.save();
      // Redirect to homepage
      res.redirect("/board/user/club");
    }
  }),
];

// Display User sign in form on GET.
exports.user_sign_in_get = asyncHandler(async (req, res, next) => {
  res.render("user_form", { title: "Sign In Form" });
});

// Handle User sign in on POST.
exports.user_sign_in_post = asyncHandler(passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/board/user/sign-in",
}));

// Display Club join form on GET.
exports.user_join_club_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User join club GET");
});

// Handle Club join on POST.
exports.user_join_club_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User join club POST");
});
