const dotenv = require("dotenv").config();
const express = require("express");
const { writeFileSync, readFileSync } = require("fs");
const userObj = require("./static-data/formValuesForForm11.js");
const getPDFForm = require("./src/utilityMethods/getForm.js");
const enableReadOnlyOnFormFields = require("./src/utilityMethods/enableReadOnlyOnFormFields.js");
const form11Path = require("./constants/filePaths.js");
const fillContinuousTextCells = require("./src/utilityMethods/fillContinuousTextCells.js");
const modifyFormField = require("./src/utilityMethods/modifyFormField.js");
const checkTheField = require("./src/utilityMethods/checkTheField.js");
const { StandardFonts, TextAlignment } = require("pdf-lib");
const Jimp = require("jimp");

// async function fillBankDetails() {
//   const env = process.env;

//   const formUrl = "./documents/BankAccountDetailsScannedForm.pdf";
//   const pdfDoc = await PDFDocument.load(readFileSync(formUrl));
//   const form = pdfDoc.getForm();

//   const formFields = form.getFields();
//   const firstPage = pdfDoc.getPage(0);
//   const BANK_DETAILS_FIELDS = env.BANK_DETAILS_FIELDS.split(",");

//   //BankACcountDeatils Form
//   BANK_DETAILS_FIELDS.forEach((fieldName) => {
//     const formField = form.getField(fieldName);
//     const fieldValue = env[fieldName];
//     modifyFormField(formField, fieldValue);
//   });

//   const imgBuffer = readFileSync("./documents/preview.png");

//     const signatureImage = await pdfDoc.embedPng(imgBuffer);
//     firstPage.drawImage(signatureImage, {
//       x: 60,
//       y: 335,
//       height: 90,
//       width: 110,
//     });

//   writeFileSync("BankDetailsPreviewForm.pdf", await pdfDoc.save());
// }

async function fillForm11() {
  const pdfDoc = await getPDFForm(form11Path);
  const form = pdfDoc.getForm();

  enableReadOnlyOnFormFields(form);

  const inputPath = "./assets/signature/sign.png";
  const outputPath = "./assets/signature/transparentSignature.png";

  Jimp.read(inputPath)
    .then((image) => {
      image
        .fade(0.9) // Set the transparency to 50%
        .write(outputPath);
    })
    .catch((err) => {
      console.error(err);
    });

  const {
    nameTitle,
    guardian,
    gender,
    name,
    guardianName,
    mobileNumber,
    emailId,
    EPF,
    EPS,
    dob,
    internationalWorker,
    country,
    passport,
    educationalQualification,
    maritalStatus,
    speciallyAbled,
    typeOfDisability,
  } = userObj;

  //signature

  const signatureBuffer = readFileSync("./assets/signature/sign.png");
  const pngImage = await pdfDoc.embedPng(signatureBuffer);

  const page = pdfDoc.getPage(2);

  // Draw the signature image with a transparent background on the page
  const [width, height] = [40, 130];
  const x = 100;
  const y = 100;
  page.drawImage(pngImage, {
    x,
    y,
    width,
    height,
    opacity: 0.3,
    blendMode: "Multiply",
  });

  //Name Title
  const nameTitleFieldName =
    nameTitle == "Ms"
      ? "nameTitleMs"
      : nameTitle === "Mr"
      ? "nameTitleMr"
      : "nameTitleMrs";

  checkTheField(form, nameTitleFieldName);

  //Candidate Name
  const candidateNamePrefix = "candidateName-";
  fillContinuousTextCells(form, candidateNamePrefix, name);

  //Candidate DOB
  const dateFieldPrefix = "dob-";
  fillContinuousTextCells(form, dateFieldPrefix, dob);

  //guardian Check Box
  const GuardianFieldName = guardian == "father" ? "father" : "husband";
  checkTheField(form, GuardianFieldName);

  //Guardian Name
  const guardianNamePrefix = "guardian-";
  fillContinuousTextCells(form, guardianNamePrefix, guardianName);

  //gender checkbox
  const genderFieldName =
    gender === "male" ? "male" : gender === "female" ? "female" : "transgender";
  checkTheField(form, genderFieldName);

  //Mobile Number
  const mobileNumberPrefix = "mobileNumber-";
  fillContinuousTextCells(form, mobileNumberPrefix, mobileNumber);

  //Email
  const emailFieldPrefix = "emailID-";
  fillContinuousTextCells(form, emailFieldPrefix, emailId);

  //EPF
  const EPFFieldName = EPF == "Y" ? "haveEPF" : "noEPF";
  checkTheField(form, EPFFieldName);

  //EPS
  const EPSFieldName = EPS == "Y" ? "haveEPS" : "noEPS";
  checkTheField(form, EPSFieldName);

  //   const imgBuffer = readFileSync("./documents/preview.png");

  //   const signatureImage = await pdfDoc.embedPng(imgBuffer);
  //   firstPage.drawImage(signatureImage, {
  //     x: 60,
  //     y: 335,
  //     height: 90,
  //     width: 110,
  //   });

  //

  const { previousEmploymentDetails } = userObj;

  const {
    UAN,
    previousPFMemberID,
    doeforPreviousMemberID,
    schemeCertificateNumber,
    PPONumber,
  } = previousEmploymentDetails;

  const uanPrefix = "uan-";

  fillContinuousTextCells(form, uanPrefix, UAN);

  if (
    typeof previousPFMemberID === "object" &&
    Object.keys(previousPFMemberID)?.length !== 0
  ) {
    for (const key in previousPFMemberID) {
      const formField = form.getField(key);
      modifyFormField(formField, previousPFMemberID[key]);
    }
  }

  typeof doeforPreviousMemberID !== undefined && doeforPreviousMemberID !== ""
    ? fillContinuousTextCells(
        form,
        "doeForPreviousMemberID-",
        doeforPreviousMemberID
      )
    : null;

  typeof schemeCertificateNumber !== undefined && schemeCertificateNumber !== ""
    ? fillContinuousTextCells(
        form,
        "scemeCertificateNumberbyPrevEmployment",
        schemeCertificateNumber
      )
    : null;

  typeof PPONumber !== undefined && PPONumber !== ""
    ? fillContinuousTextCells(form, "PPObyPrevEmployment", PPONumber)
    : null;

  typeof PPONumber !== undefined && PPONumber !== ""
    ? fillContinuousTextCells(form, "PPObyPrevEmployment", PPONumber)
    : null;

  internationalWorker === "N"
    ? checkTheField(form, "notAnInternationalWorker")
    : (() => {
        checkTheField(form, "internationalWorker");

        country === " India"
          ? checkTheField(form, "indian")
          : modifyFormField(form, "countryOfOrigin");

        if (
          typeof passport === "object" &&
          Object.keys(passport)?.length !== 0
        ) {
          const { passportNumber, validFrom, dateOfExpiry } = passport;

          passportNumber !== undefined && passportNumber !== ""
            ? (function () {
                const passportNumberField = form.getField("passportNumber");
                modifyFormField(passportNumberField, passportNumber);
              })()
            : null;

          //Passport Valid From
          validFrom !== undefined && validFrom !== ""
            ? fillContinuousTextCells(form, "passportValidFrom-", validFrom)
            : null;

          //Passport Valid From
          validTo !== undefined && validTo !== ""
            ? fillContinuousTextCells(form, "passportValidTo-", validTo)
            : null;
        }
      })();

  checkTheField(form, `${educationalQualification}`);
  checkTheField(form, `${maritalStatus}`);

  speciallyAbled === "Y"
    ? (() => {
        checkTheField(form, "speciallyAbled");
        checkTheField(form, `${typeOfDisability}`);
      })()
    : checkTheField(form, "noDisability");

  const { kycDetails } = userObj;

  async function iterateObject(obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === "object") {
          iterateObject(obj[key]);
        } else {
          const formField = form.getTextField(`${key}`);
          formField.setFontSize(7);
          modifyFormField(formField, obj[key]);
        }
      }
    }
  }
  //KYC Details
  iterateObject(kycDetails);

  //Date:

  const dateField = form.getTextField("date");
  dateField.setAlignment(TextAlignment.Left);
  modifyFormField(dateField, new Date().toLocaleDateString("en-US"));

  //Place:
  const placeField = form.getTextField("place");
  placeField.setAlignment(TextAlignment.Left);
  modifyFormField(placeField, userObj.place);

  writeFileSync("Form11PreviewForm.pdf", await pdfDoc.save());
}
const app = express();

const port = process.env.PORT || 5002;

app.get("/", (req, res) => {
  res.send("Get all contacts");
});

app.listen(port, () => {
  console.log("Server is running");
});

fillForm11().catch((err) => console.log(err));
