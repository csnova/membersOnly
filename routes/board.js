const express = require("express");
const router = express.Router();

// Require controller modules.
const message_controller = require("../controllers/messageController");
const user_controller = require("../controllers/userController");

/// Message ROUTES ///

// GET message board home page.
router.get("/", message_controller.index);

// GET request for creating a message. NOTE This must come before routes that display message (uses the message id).
router.get("/message/create", message_controller.message_create_get);

// POST request for creating Message.
router.post("/message/create", message_controller.message_create_post);

// GET request for one Message.
router.get("/message/:id", message_controller.message_detail);

// GET request for list of all Message items.
router.get("/messages", message_controller.message_list);

/// User ROUTES ///

// GET request for creating User. NOTE This must come before route for id (i.e. display user).
router.get("/user/sign-up", user_controller.user_sign_up_get);

// POST request for creating User.
router.post("/user/sign-up", user_controller.user_sign_up_post);

// GET request User Sign In
router.get("/user/sign-in", user_controller.user_sign_in_get);

// POST request User Sign In
router.post("/user/sign-in", user_controller.user_sign_in_post);

// GET request to join club.
router.get("/user/club", user_controller.user_join_club_get);

// POST request to join cub.
router.post("/user/club", user_controller.user_join_club_post);

// GET request for one User.
router.get("/user/:id", user_controller.user_detail);

// GET request for list of all Users.
router.get("/users", user_controller.user_list);

module.exports = router;
