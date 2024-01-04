const User = require("../models/user");
const Message = require("../models/message");
const passport = require("passport");
const bcrypt = require("bcryptjs");
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
    user: req.user,
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
    user: req.user,
    title: "User Detail",
    current_user: user,
    user_messages: allMessagesByUser,
  });
});

// Display User sign up form on GET.
exports.user_sign_up_get = (req, res, next) => {
  res.render("new_user_form", { user: req.user, title: "Sign Up Form" });
};

// Handle User sign up on POST.
exports.user_sign_up_post = [
  // Validate and sanitize fields.
  body("first_name").trim().isLength({ min: 1 }).escape(),
  body("family_name").trim().isLength({ min: 1 }).escape(),
  body("username")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters long.")
    .custom(async (value) => {
      const existingUser = await User.findByUsername(value);
      if (existingUser) {
        // Will use the below as the error message
        throw new Error("A user already exists with this username");
      }
    })
    .isAlphanumeric()
    .withMessage("Username has non-alphanumeric characters.")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .escape(),
  body("confirm_password")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords Do Not Match"),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      // Create Users object with escaped and trimmed data
      const user = new User({
        username: req.body.username.toLowerCase(), // Convert to lowercase
        password: hashedPassword,
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        membership: "Base",
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

        // Log in the user after successful signup
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          // Redirect to homepage
          res.redirect("/board/user/club");
        });
      }
    });
  }),
];

// Display User sign in form on GET.
exports.user_sign_in_get = asyncHandler(async (req, res, next) => {
  res.render("user_form", { user: req.user, title: "Sign In Form" });
});

// Handle User sign in on POST.
exports.user_sign_in_post = asyncHandler(
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/board/user/sign-in",
  })
);

// Display User sign out form on GET.
exports.user_sign_out_get = asyncHandler(async (req, res, next) => {
  res.render("sign_out_form", { user: req.user, title: "Sign Out" });
});

// Handle User sign out on POST.
exports.user_sign_out_post = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Display Club join form on GET.
exports.user_join_club_get = asyncHandler(async (req, res, next) => {
  res.render("club_form", {
    user: req.user,
    error: false,
    title: "Members Only Club",
  });
});

// Handle Club join on POST.
exports.user_join_club_post = [
  asyncHandler(async (req, res, next) => {
    // Create a new user object with escaped/trimmed data and old id
    const user = new User({
      username: req.user.username,
      password: req.user.password,
      first_name: req.user.first_name,
      family_name: req.user.family_name,
      membership: "Premium",
      _id: req.user.id,
    });

    if (req.body.code !== "lazer") {
      // The code is wrong
      res.render("club_form", {
        user: req.user,
        error: true,
        title: "Members Only Club",
      });
      return;
    } else {
      // Code is valid.
      const updatedUser = await User.findByIdAndUpdate(req.user.id, user, {});
      // Redirect
      res.redirect(updatedUser.url);
    }
  }),
];
