const modifyFormField = (formField, fieldValue) => {
  formField.setText(fieldValue);
  formField.enableReadOnly();
};

module.exports = modifyFormField;