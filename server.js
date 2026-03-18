const express = require("express");
const cors = require("cors");
const ytdlp = require("yt-dlp-exec");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ GET INFO
app.post("/api/info", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).send("URL required");
  }

  try {
    const info = await ytdlp(url, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true
    });

    res.json({
      title: info.title,
      thumbnail: info.thumbnail,
      formats: info.formats
        .filter(f => f.vcodec !== "none")
        .map(f => ({
          quality: f.format_note || f.height + "p",
          url: f.url
        }))
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch info");
  }
});

// ✅ DOWNLOAD
app.post("/api/download", async (req, res) => {
  const { url, quality } = req.body;

  if (!url) {
    return res.status(400).send("URL required");
  }

  try {
    const info = await ytdlp(url, {
      dumpSingleJson: true
    });

    let selected;

    if (quality === "mp3") {
      selected = info.formats.find(f => f.acodec !== "none");
    } else {
      selected = info.formats.find(
        f => f.height && f.height <= parseInt(quality)
      );
    }

    if (!selected) {
      selected = info.formats[0];
    }

    res.json({
      downloadUrl: selected.url
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Download failed");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on", PORT));
