import { convert } from "libreoffice-convert";
import fs from "fs";
import path from "path";
export const fileConvertController = async (req, res) => {
  const { targetFormat } = req.body;
  if (!req.file || !targetFormat) {
    return res
      .status(400)
      .json({ error: "File and target format are required" });
  }

  const inputFilePath = req.file.path;
  const fileBaseName = path.parse(req.file.path).name;
  const outputFilePath = path.join(
    req.file.destination,
    `${fileBaseName}.${targetFormat}`
  );
  const inputFileBuffer = fs.readFileSync(inputFilePath);

  try {
    convert(
      inputFileBuffer,
      targetFormat,
      undefined,
      (err, outputFileBuffer) => {
        if (err) {
          fs.unlinkSync(inputFilePath); // Clean up the input file
          console.error(err);
          return res.status(500).json({ error: "File conversion failed" });
        }

        fs.writeFileSync(outputFilePath, outputFileBuffer);

        res.download(outputFilePath, (downloadErr) => {
          if (downloadErr) {
            console.error(downloadErr);
            return res.status(500).json({ error: "File download failed" });
          }
          fs.unlinkSync(inputFilePath);
          fs.unlinkSync(outputFilePath);
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "File conversion failed" });
  }
};
