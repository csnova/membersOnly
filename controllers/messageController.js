const Message = require("../models/message");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of messages and user counts (in parallel)
  const [numMessages, numUsers] = await Promise.all([
    Message.countDocuments({}).exec(),
    User.countDocuments({}).exec(),
  ]);

  res.render("index", {
    user: req.user,
    title: "Members Only Home",
    message_count: numMessages,
    user_count: numUsers,
  });
});

// Display list of all messages.
exports.message_list = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find({}, "title text user timestamp")
    .sort({ timestamp: 1 })
    .populate("user")
    .exec();

  res.render("message_list", {
    user: req.user,
    title: "Message List",
    message_list: allMessages,
  });
});

// Display detail page for a specific message.
exports.message_detail = asyncHandler(async (req, res, next) => {
  const [message] = await Promise.all([
    Message.findById(req.params.id).populate("user").exec(),
  ]);

  if (message === null) {
    // No results.
    const err = new Error("Message not found");
    err.status = 404;
    return next(err);
  }

  res.render("message_detail", {
    user: req.user,
    title: message.title,
    message: message,
  });
});

// Display message create form on GET.
exports.message_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message create GET");
});

// Handle message create on POST.
exports.message_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message create POST");
});
