// const express = require("express");
const dotenv = require("dotenv").config();

// const app = express();

// const port = process.env.PORT || 5002;

// app.get("/api/contacts", (req, res) => {
//   console.log(req, res + " Hi Hello");
//   res.send("Get all contacts");
//   console.log(req, res + " Hi Hello");
// });

// app.listen(port, () => {
//   console.log("Server is running");
// });

const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const { writeFileSync, readFileSync, unlink, unlinkSync } = require("fs");

async function createPDF() {
  const env = process.env;
  const document = await PDFDocument.load(
    readFileSync("./documents/form13.pdf")
  );
// 
  const courierBoldFont = await document.embedFont(StandardFonts.Courier);
  const firstPage = document.getPage(0);

  firstPage.moveTo(220, 645);
  firstPage.drawText(env.NAME, {
    font: courierBoldFont,
    size: 11,
  });

  firstPage.moveTo(220, 585);
  firstPage.drawText(env.GENDER, {
    font: courierBoldFont,
    size: 11,
  });

  firstPage.moveTo(220, 527);
  firstPage.drawText(env.FATHER, {
    font: courierBoldFont,
    size: 11,
  });

  firstPage.moveTo(220, 469);
  firstPage.drawText(env.DESIGNATION, {
    font: courierBoldFont,
    size: 11,
  });

  firstPage.moveTo(220, 436);
  firstPage.drawText(env.PERMANENT_ADDRESS, {
    font: courierBoldFont,
    size: 10,
    maxWidth: 150,
    lineHeight: 10,
    textAlign: "justify",
  });

  firstPage.moveTo(220, 384);
  firstPage.drawText(env.LOCAL_ADDRESS, {
    font: courierBoldFont,
    size: 10,
    maxWidth: 150,
    lineHeight: 10,
    textAlign: "justify",
  });

  firstPage.moveTo(220, 315);
  firstPage.drawText(env.DOJ, {
    font: courierBoldFont,
    size: 11,
  });

  const imgBuffer = readFileSync("./documents/preview.png");

  const signatureImage = await document.embedPng(
    imgBuffer,
    "TransparentSignature"
  );
  firstPage.drawImage(signatureImage, {
    x: 220,
    y: 235,
    height: 70,
    width: 90,
  });

  writeFileSync("form13Preview.pdf", await document.save());
}

createPDF().catch((err) => console.log(err));
