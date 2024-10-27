import express from "express";
import bodyParser from "body-parser";
import { PythonShell } from "python-shell";
import cors from "cors";
import multer from "multer";
import fs from "fs";

const app = express();

const upload = multer({ dest: "uploads/" });
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const oldPath = file.path;
    const newPath = `${file.destination}/${file.originalname}`;
    fs.renameSync(oldPath, newPath);
    let options = {
      args: [file.originalname],
    };
    PythonShell.run("./catAndDogPredict.py", options)
      .then((messages) => {
        console.log(messages[2]);
        res.json({ prediction: messages[2] });
      })
      .catch((e) => {
        console.log("Error:", e);
        res.json({ e });
      });
  } catch (e) {
    console.log("Error:", e);
    res.json({ e });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
