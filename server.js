const express = require("express");
const cors = require("cors");
const ytdlp = require("yt-dlp-exec");

const app = express();
app.use(cors());
app.use(express.json());

// GET INFO
app.post("/api/info", async (req, res) => {
  try {
    const { url } = req.body;

    const info = await ytdlp(url, {
      dumpSingleJson: true
    });

    res.json({
      title: info.title,
      thumbnail: info.thumbnail
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching info");
  }
});

// DOWNLOAD
app.post("/api/download", async (req, res) => {
  try {
    const { url } = req.body;

    const info = await ytdlp(url, {
      getUrl: true
    });

    res.json({
      downloadUrl: info
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Download failed");
  }
});

app.listen(5000, () => console.log("Server running"));
