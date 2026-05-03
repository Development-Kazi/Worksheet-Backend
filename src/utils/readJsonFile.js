import { readFile } from "fs/promises";

const readJsonFile = async (filePath) => {
  try {
    const data = await readFile(filePath, "utf8");
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (err) {
    console.error("Error reading or parsing the file:", err);
    return null;
  }
};

export { readJsonFile };
