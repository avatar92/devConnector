const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  //validation for school
  if (validator.isEmpty(data.school)) {
    errors.school = "School field is required";
  }

  //validation for degree
  if (validator.isEmpty(data.degree)) {
    errors.degree = "Degree field is required";
  }

  //validation for fieldofstudy
  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Field of study field is required";
  }

  //validation for from
  if (validator.isEmpty(data.from)) {
    errors.from = "From Date field is required";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
