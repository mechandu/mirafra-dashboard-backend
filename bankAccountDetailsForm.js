const dotenv = require("dotenv").config();
const express = require("express");
const { readFileSync, writeFileSync } = require("fs");
const { type } = require("os");
const { PDFDocument, StandardFonts, rgb, TextAlignment } = require("pdf-lib");

async function fillForm13() {
  const env = process.env;

  const formUrl = "./documents/BankAccountDetailsScannedForm.pdf";
  const pdfDoc = await PDFDocument.load(readFileSync(formUrl));
  const form = pdfDoc.getForm();

  const formFields = form.getFields();

  for (let field of formFields) {
    field.enableReadOnly();
    console.log(field.getName());
  }

  //BankACcountDeatils Form

  const candidateNameField = form.getField("nameAsPerBankAccount");
  candidateNameField.setText(env.CANDIDATE_NAME);

  const empIDField = form.getField("empid");
  empIDField.setText(env.EMPID);

  const bankAccountNumberField = form.getField("bankAccountNumber");
  bankAccountNumberField.setText(env.BANK_ACCOUNT_NUMBER);

  const bankNameField = form.getField("nameOfBank");
  bankNameField.setText(env.BANK_NAME);

  const branchNameField = form.getField("nameOfBranch");
  branchNameField.setText(env.BRANCH_NAME);

  const ifscCodeField = form.getField("IFSCCode");
  ifscCodeField.setText(env.IFSC);

  const micrCodeField = form.getField("MICRCode");
  micrCodeField.setText(env.MICR_CODE);

  const cityField = form.getField("City");
  cityField.setText(env.CITY);

  const signatureField = form.getField("Signature");
  signatureField.setText(env.MICR_CODE);

  // Form13

  //   const nameField = form.getField("name");
  //   nameField.setText(env.NAME);

  //   const genderField = form.getField("gender");
  //   genderField.setText(env.GENDER);

  //   const fatherHusbandNameField = form.getField("fatherHusbandName");
  //   fatherHusbandNameField.setText(env.FATHER_HUSBAND_NAME);

  //   const permanentAddressField = form.getField("permanentAddress");
  //   permanentAddressField.setText(env.PERMANENT_ADDRESS);

  //   const localAddressField = form.getField("localAAddress");
  //   localAddressField.setText(env.LOCAL_ADDRESS);

  //   const dojField = form.getField("doj");
  //   dojField.setText(env.DOJ);

  //   const designationField = form.getField("designation");
  //   designationField.setText(env.DESIGNATION);

  writeFileSync("form13PreviewForm.pdf", await pdfDoc.save());
}

export default fillForm13;