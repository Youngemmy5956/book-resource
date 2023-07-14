import express from "express";
// import Comment_model from "../model/comments.js";
// import Post_model from "../model/posts.js"
import User_model from "../model/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// import auth from "../middleware/auth.js";

const router = express.Router();



// auth create  user


router.post("/users/createUser", async (req, res) => {
  const { name, email, mobile, password, confirmPassword} = req.body;
 if (password !== confirmPassword) {
    return res.status(400).json({ message: "password not match" });
  }
  if(password.length < 8){
    return res.status(400).json({ message: "password must be 8 character" });
  }
  if (role !== "admin" && role !== "user") {
    return res.status(400).json({ message: "role must be admin or user" });
  }
  if (mobile.length !== 11) {
    return res.status(400).json({ message: "mobile number must be 10 digit" });
  }
  if(email.indexOf("@") === -1){
    return res.status(400).json({ message: "email must be valid" });
    }
    if(email.indexOf(".") === -1){
    return res.status(400).json({ message: "email must be valid" });
    }
  try {
    bcrypt.hash(password, 10).then( async (hash) => {
      await User_model.create({ name, email, mobile, password: hash, confirmPassword: hash})
      .then(
        (user) => {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, email },
            process.env.JWT_SECRECT_KEY,
            { expiresIn: maxAge }
          );
          res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(201).json({ message: "User successfully created", user });
        }
      );
    });
  } catch (err) {
    res.status(400).json({
      message: "User not successfully created",
      error: err.message,
    });
  }
});

// auth login user

router.post("/users/loginUser", async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password is provided
  if (!email || !password) {
    return res.status(400).json({ message: "email or password not provided " });
  }
  try {
    const user = await User_model.findOne({ email });
    if (!user) {
      res
        .status(400)
        .json({ message: "Login not successful", error: "User not found" });
    } else {
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, email },
            process.env.JWT_SECRECT_KEY,
            { expiresIn: maxAge }
          );

          // user.token = token;

          res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
          res.status(201).json({ message: "Login successful", user, token });
        } else {
          res.status(400).json({ message: "Invalid Credentials" });
        }
      });
    }
  } catch (err) {
    res.status(400).json({ message: "An error occurred", error: err.message });
  }
});

// auth create  Blog post

router.post("/blogs/createPost", async (req, res) => {
  const { author, titles, description,  posts } = req.body;
    try {
      const post = await Post_model.create({ author, titles, description,  posts });
      res.status(201).json({ post });
    }
    catch (err) {
      res.status(400).json({ message: err.message });
    }
});


// get all Blog post

router.get("/blogs/getAllPost", async (req, res) => {
  try {
    const posts = await Post_model.find();
    res.status(200).json({posts });
  }
  catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// get single Blog post

router.get("/blogs/getSinglePost/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Post_model.findById(id).then((post) => {
      res.status(201).json({ message: "post successfully listed", post });
    });
  } catch (err) {
    res.status(400).json({
      message: "post not successfully listed",
      error: err.message,
    });
  }
});

// update Blog post

router.put("/blogs/updatePost/:id", async (req, res) => {
  const { id } = req.params;
  const { author, titles, description, post } = req.body;
  try {
     await  Post_model.findByIdAndUpdate(id, { author, titles, description, post }).then((post) => {
      res.status(201).json({ message: "post successfully updated", post });
    });
  } catch (err) {
    res.status(400).json({
      message: "post not successfully updated",
      error: err.message,
    });
  }
});

// delete Blog post

router.delete("/blogs/deletePost/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Post_model.findByIdAndDelete(id).then((post) => {
      res.status(201).json({ message: "post successfully deleted", post });
    });
  } catch (err) {
    res.status(400).json({
      message: "post not successfully deleted",
      error: err.message,
    });
  }
});

  


// auth create comment post

router.post("/blogs/createComment", async (req, res) => {
  const { name, upvotes, comments } = req.body;
    try {
      const comment = await Comment_model.create({ name, upvotes, comments });
      res.status(201).json({ comment });
    }
    catch (err) {
      res.status(400).json({ message: err.message });
    }
});


// get all comments post

router.get("/blogs/getAllComment", async (req, res) => {
  try {
    const comments = await Comment_model.find();
    res.status(200).json({comments });
  }
  catch (err) {
    res.status(404).json({ message: err.message });
  }
});


// get single comment post

router.get("/blogs/getSingleComment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Comment_model.findById(id).then((comments) => {
      res.status(201).json({ message: "comment successfully listed", comments });
    });
  } catch (err) {
    res.status(400).json({
      message: "comment not successfully listed",
      error: err.message,
    });
  }
});

// update comment post

router.put("/blogs/updateComment/:id", async (req, res) => {
  const { id } = req.params;
  const { name, upvotes, comments } = req.body;
  try {
    await Comment_model.findByIdAndUpdate(id, { name, upvotes, comments }).then(
      (comments) => {
        res.status(201).json({ message: "comment successfully updated", comments });
      }
    );
  } catch (err) {
    res.status(400).json({
      message: "comment not successfully updated",
      error: err.message,
    });
  }
});


// delete comment post

router.delete("/blogs/deleteComment/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Comment_model.findByIdAndDelete(id).then((comments) => {
      res.status(201).json({ message: "comment successfully deleted", comments });
    });
  } catch (err) {
    res.status(400).json({
      message: "comment not successfully deleted",
      error: err.message,
    });
  }
});



export default router;
