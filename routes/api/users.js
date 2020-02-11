const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = require("../../config/keys");
const router = express.Router();

//load Input validation
const validationRegisterInput = require("../../validation/register");
const validationLoginInput = require("../../validation/login");

//load user model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    tests users route
// @access  public
router.get("/test", (req, res) => {
  res.json({ msg: "Users works" });
});

// @route   POST api/users/test
// @desc    Register user
// @access  public
router.post("/register", (req, res) => {
  //checking validation
  const { errors, isValid } = validationRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exist";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: gravatar.url(req.body.email, { s: "200", r: "pg", d: "mm" }),
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(e => console.log("this is the error", e));
        });
      });
    }
  });
});
// @route   POST api/users/login
// @desc    Login user Returning jwt token
// @access  public

router.post("/login", (req, res) => {
  const { errors, isValid } = validationLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  //find the user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "user not found";
      return res.status(404).json(errors);
    }

    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user matched

        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        }; //create jwt payload
        //sign the token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              sucess: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        errors.password = "password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});
// @route   POST api/users/current
// @desc    Return Current user
// @access  Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
