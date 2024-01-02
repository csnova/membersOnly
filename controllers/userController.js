const User = require("../models/user");
const asyncHandler = require("express-async-handler");

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
  res.send(`NOT IMPLEMENTED: User detail: ${req.params.id}`);
});

// Display User sign up form on GET.
exports.user_sign_up_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User sign up GET");
});

// Handle User sign up on POST.
exports.user_sign_up_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User sign up POST");
});

// Display User sign in form on GET.
exports.user_sign_in_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User sign in GET");
});

// Handle User sign in on POST.
exports.user_sign_in_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User sign in POST");
});

// Display Club join form on GET.
exports.user_join_club_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User join club GET");
});

// Handle Club join on POST.
exports.user_join_club_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User join club POST");
});
