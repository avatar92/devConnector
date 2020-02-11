const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();

//requiring Post Model
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//require validation for post
const validatePostInput = require("../../validation/post");

// @route   GET api/post/test
// @desc    tests post route
// @access  public
router.get("/test", (req, res) => {
  res.json({ msg: "post works" });
});

// @route   GET api/post/
// @desc    GET post
// @access  public
router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "there is no posts" }));
});

// @route   GET api/post/:id
// @desc    GET post by id
// @access  public
router.get("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .then(post => res.json(post))
    .catch(err =>
      res
        .status(404)
        .json({ nopostfound: "there is no post found with that id" })
    );
});

// @route   POST api/post
// @desc    create a post
// @access  private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //check our validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    console.log(newPost.avatar);
    newPost
      .save()
      .then(post => {
        res.json(post);
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route   POST api/post/like/:id
// @desc    like a post
// @access  private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    console.log(req.user.id);
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res.status(400).json({ alreadyLiked: "user already liked" });
          }
          //add user id to likes array
          post.likes.unshift({ user: req.user.id });
          //save in data base
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "post is not found" })
        );
    });
  }
);

// @route   POST api/post/unlike/:id
// @desc    Unlike a post
// @access  private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "you have not yet liked this post" });
          }
          //GET remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          //splice out of array
          post.likes.splice(removeIndex, 1);
          //save
          post.save().then(post => res.json(post));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "post is not found" })
        );
    });
  }
);
// @route   POST api/post/comment/:id
// @desc    Add a comment
// @access  private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //check our validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };
        //add to comment array
        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({ postnotfound: "post is not found" })
      );
  }
);
// @route   DELETE api/post/comment/:id/:comment_id
// @desc    Delete a comment
// @access  private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //check if the commnet exist
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ) === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexist: "comment does not exist" });
        }
        //Get remove index
        const removeIndex = post.comments
          .map(comment => comment._id.toString())
          .indexOf(req.params.comment_id);
        //splice from the remove index
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err =>
        res.status(404).json({ postnotfound: "post is not found" })
      );
  }
);
// @route   DELETE api/post/:id
// @desc    DELETE post by id
// @access  private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        console.log(profile);
        Post.findById(req.params.id)
          .then(post => {
            console.log(post.user);

            if (post.user.toString() !== req.user.id) {
              return res
                .status(401)
                .json({ notauthorized: "User not authorized" });
            }
            post.remove().then(() => res.json({ success: true }));
          })
          .catch(err =>
            res
              .status(404)
              .json({ postnotfound: "Post with that id is not found" })
          );
      })
      .catch(err =>
        res
          .status(404)
          .json({ nopostfound: "there is no post found with that id" })
      );
  }
);
module.exports = router;
