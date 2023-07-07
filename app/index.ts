import express from "express";
import { createCanvas } from "canvas";

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  try {
    const width = 400;
    const height = 200;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "white";
    ctx.font = "48px serif";
    ctx.fillText("Charity Royale!!", 50, 100);

    const buffer = canvas.toBuffer("image/png");
    res.set("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
