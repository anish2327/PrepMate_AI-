import { PDFParse } from "pdf-parse";

export const extractResumeText = async (buffer) => {
  const parser = new PDFParse({
    data: buffer,
  });

  try {
    const result = await parser.getText();

    return result.text;
  } finally {
    await parser.destroy();
  }
};

export const createChunks = (text, chunkSize = 1000) => {
  const cleanText = text
    .replace(/\s+/g, " ")
    .trim();

  const chunks = [];

  for (let i = 0; i < cleanText.length; i += chunkSize) {
    chunks.push(
      cleanText.slice(i, i + chunkSize)
    );
  }

  return chunks;
};