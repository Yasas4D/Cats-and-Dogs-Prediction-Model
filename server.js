const express = require("express");
const bodyParser = require("body-parser");
const { PythonShell } = require("python-shell");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();

const upload = multer({ dest: "uploads/" });
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    const file = req.file;
    const oldPath = file.path;
    const newPath = `${file.destination}/${file.originalname}`;
    fs.renameSync(oldPath, newPath);
    let options = {
      args: [file.originalname],
    };
    PythonShell.run("./beeDiseasePredict.py", options)
      .then((messages) => {
        console.log(messages[1]);
        res.json({ prediction: messages[1] });
      })
      .catch((e) => {
        console.log("-----Error----", e);
        res.json({ e });
      });
  } catch (e) {
    console.log("-----Error----");
    res.json({ e });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
