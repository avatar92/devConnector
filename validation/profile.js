const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : "";
  data.status = !isEmpty(data.status) ? data.status : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  //validation for Handle
  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = "Handle need to be between 2 and 40 character";
  }
  if (validator.isEmpty(data.handle)) {
    errors.handle = "Profile handle is required";
  }

  //validator for Status
  if (validator.isEmpty(data.status)) {
    errors.status = "Status field is required";
  }

  //validator for skills
  if (validator.isEmpty(data.skills)) {
    errors.skills = "Skills field is required";
  }
  //validator for website
  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "Not a valid URL";
    }
  }
  //validator for website
  if (!isEmpty(data.website)) {
    if (!validator.isURL(data.website)) {
      errors.website = "Not a valid URL";
    }
  }
  //validator for youtube
  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = "Not a valid URL";
    }
  }
  //validator for twitter
  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = "Not a valid URL";
    }
  }
  //validator for facebook
  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = "Not a valid URL";
    }
  }
  //validator for linkedin
  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = "Not a valid URL";
    }
  }
  //validator for instegram
  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = "Not a valid URL";
    }
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
