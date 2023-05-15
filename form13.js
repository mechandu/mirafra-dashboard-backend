const dotenv = require("dotenv").config();
const { readFileSync, writeFileSync } = require("fs");
const { PDFDocument, StandardFonts, rgb, TextAlignment } = require("pdf-lib");

async function fillForm13() {
  const env = process.env;

  const formUrl = "./documents/form13.pdf";
  const pdfDoc = await PDFDocument.load(readFileSync(formUrl));
  const form = pdfDoc.getForm();

  const formFields = form.getFields();

//   const modifyFormField = (field, name) => {
//     field.setText(name);
//   };
console.log(env.fillBankDetails);
//   for (let field of formFields) {
//     modifyFormField(field, env.NAME);
//   }

  // Form13

  // const nameField = form.getField("name");
  // nameField.setText(env.NAME);

  const genderField = form.getField("gender");
  genderField.setText(env.GENDER);

  const fatherHusbandNameField = form.getField("fatherHusbandName");
  fatherHusbandNameField.setText(env.FATHER_HUSBAND_NAME);

  const permanentAddressField = form.getField("permanentAddress");
  permanentAddressField.setText(env.PERMANENT_ADDRESS);

  const localAddressField = form.getField("localAAddress");
  localAddressField.setText(env.LOCAL_ADDRESS);

  const dojField = form.getField("doj");
  dojField.setText(env.DOJ);

  const designationField = form.getField("designation");
  designationField.setText(env.DESIGNATION);

  writeFileSync("form13PreviewForm.pdf", await pdfDoc.save());
}

export default fillForm13;
