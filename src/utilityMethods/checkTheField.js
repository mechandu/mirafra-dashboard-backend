const checkTheField = (form, fieldName) => {
  const nameTitleField = form.getCheckBox(fieldName);
  nameTitleField.check();
};

module.exports = checkTheField;
