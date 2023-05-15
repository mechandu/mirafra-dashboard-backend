const enableReadOnlyOnFormFields = (form) => {
  const formFields = form.getFields();
  formFields.forEach((field) => {
    field.enableReadOnly();
  });
};

module.exports = enableReadOnlyOnFormFields;
