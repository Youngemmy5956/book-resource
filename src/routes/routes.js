import express from "express"
import User_model from "../model/users.js";
import Book_model from "../model/books.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();



// auth create  user


router.post("/createUser", async (req, res) => {
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

router.post("/loginUser", async (req, res, next) => {
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

// auth logout user

router.get("/logoutUser", (req, res) => {

    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "Logout successful" });
});

// auth create Book

router.post("/createBook", async (req, res) => {
  const { author, titles, image, name,  pages, price} = req.body;
    try {
      const post = await Book_model.create({ author, titles, image, name,  pages, price});
      res.status(201).json({ post });
    }
    catch (err) {
      res.status(400).json({ message: err.message });
    }
});


// get all Book

router.get("/getAllBook", async (req, res) => {
  try {
    const books = await Book_model.find();
    res.status(200).json({books});
  }
  catch (err) {
    res.status(404).json({ message: err.message });
  }
});

// get single Book

router.get("/getSingleBook/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Post_model.findById(id).then((book) => {
      res.status(201).json({ message: "book successfully listed", book });
    });
  } catch (err) {
    res.status(400).json({
      message: "book not successfully listed",
      error: err.message,
    });
  }
});

// update  Update book


router.put("/updateBook/:id", async (req, res) => {
  const { id } = req.params;
  const { author, titles, image, name,  pages, price } = req.body;
  try {
     await  Book_model.findByIdAndUpdate(id, {  author, titles, image, name,  pages, price }).then((book) => {
      res.status(201).json({ message: "book successfully updated", book });
    });
  } catch (err) {
    res.status(400).json({
      message: "book not successfully updated",
      error: err.message,
    });
  }
});

// delete Book

router.delete("/deleteBook/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Book_model.findByIdAndDelete(id).then((book) => {
      res.status(201).json({ message: "book successfully deleted", book });
    });
  } catch (err) {
    res.status(400).json({
      message: "book not successfully deleted",
      error: err.message,
    });
  }
});




export default router;
