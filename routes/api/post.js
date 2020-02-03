const express = require("express");

const router = express.Router();

// @route   GET api/post/test
// @desc    tests post route
// @access  public
router.get("/test", (req, res) => {
  res.json({ msg: "post works" });
});

module.exports = router;
