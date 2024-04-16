const express = require("express");
const User = require("../models/user.js");
const auth = require("../middleware/auth.js");
const {
  register,
  profile,
  login,
  logout,
  deleteUser,
  update,
  updateProfilepic,
  upload,
  getProfilepic,
  searchUser,
  getUser,
} = require("../controllers/user.js");
const router = express.Router();

router.get("/me", auth, profile);

router.post("/login", login);

router.post("/register",register);

router.post("/avatar", auth, upload.single("profileimg"), updateProfilepic);

router.post("/logout", auth, logout);

router.delete("/me", auth, deleteUser);

router.patch("/me", auth, update);

router.get("/profile-picture/:id", getProfilepic);

router.get("/:id",auth,getUser)

router.get("/search-user/:username",auth,searchUser)

module.exports = router;
