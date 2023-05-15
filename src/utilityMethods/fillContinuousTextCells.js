const modifyFormField = require('./modifyFormField')

const fillContinuousTextCells = (form, fieldPrefix, fieldValue) => {
  for (let i = 0; i < fieldValue.length; i++) {
    const formField = form.getField(fieldPrefix + i);
    modifyFormField(formField, fieldValue[i]);
  }
};

module.exports = fillContinuousTextCells;
