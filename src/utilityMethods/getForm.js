const { readFileSync, writeFileSync } = require("fs");
const { PDFDocument, StandardFonts, rgb, TextAlignment } = require("pdf-lib");

const getPDFForm = async (formURL) => {
  try {
    const pdfDoc = await PDFDocument.load(readFileSync(formURL));
    return pdfDoc;
  } catch (e) {
    console.log(e);
  }
};

module.exports = getPDFForm;
