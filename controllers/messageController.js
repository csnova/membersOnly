const Message = require("../models/message");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
});

// Display list of all messages.
exports.message_list = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message list");
});

// Display detail page for a specific message.
exports.message_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Message detail: ${req.params.id}`);
});

// Display message create form on GET.
exports.message_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message create GET");
});

// Handle message create on POST.
exports.message_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message create POST");
});
