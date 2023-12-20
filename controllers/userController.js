const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// Display list of all Authors.
exports.user_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User list");
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
