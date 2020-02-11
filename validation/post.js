const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data = {}) {
  let errors = {};
  // console.log(isEmpty(data.text));
  data.text = !isEmpty(data.text) ? data.text : "";
  // console.log("the new data.text is :", data.text);
  //validation for text
  if (validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }
  if (!validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = `Post must be between 10 et 300 characters and your text is ${data.text.length} character`;
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
