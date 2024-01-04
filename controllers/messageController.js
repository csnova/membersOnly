const Message = require("../models/message");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
exports.message_create_get = (req, res, next) => {
  res.render("new_message_form", { user: req.user, title: "New Message" });
};

// Handle message create on POST.
exports.message_create_post = [
  // Validate and sanitize fields.
  body("title")
    .trim()
    .isLength({ min: 1 })
    .withMessage("There must be a title."),
  body("text")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Message text must be at least 8 characters long."),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create message object with escaped and trimmed data
    const dateTime = new Date();
    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      user: req.user,
      timestamp: dateTime,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("new_message_form", {
        user: req.user,
        title: "New Message",
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save message.
      await message.save();
      // Redirect to messages
      res.redirect("/board/messages");
    }
  }),
];

// Display message delete form on GET.
exports.message_delete_get = asyncHandler(async (req, res, next) => {
  const [message] = await Promise.all([Message.findById(req.params.id).exec()]);

  if (message === null) {
    // No results.
    const err = new Error("Message not found");
    err.status = 404;
    return next(err);
  }

  res.render("delete_form", {
    user: req.user,
    message: message,
    title: "Delete Message",
  });
});

// Handle message delete form on GET.
exports.message_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of message
  const [message] = await Promise.all([Message.findById(req.params.id).exec()]);

  //Delete message and redirect to list of messages.
  await Message.findByIdAndDelete(req.body.messageid);
  res.redirect(`/board/messages`);
});
