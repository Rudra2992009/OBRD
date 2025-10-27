import express from "express";
import multer from "multer";
import fetch from "node-fetch";
const app = express();
const upload = multer();

app.post("/api/detect", upload.single("frame"), async (req, res) => {
  const response = await fetch("http://127.0.0.1:8500/detect", {
    method: "POST",
    body: req.file.buffer
  });
  const data = await response.json();
  res.json(data);
});

app.listen(8000, () => console.log("API relay running on port 8000"));
