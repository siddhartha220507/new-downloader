const express = require("express");
const cors = require("cors");
const ytdl = require("@distube/ytdl-core");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/info", async (req, res) => {
  try {
    const { url } = req.body;

    const info = await ytdl.getInfo(url);

    res.json({
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0].url
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching info");
  }
});

app.post("/api/download", async (req, res) => {
  try {
    const { url } = req.body;

    const info = await ytdl.getInfo(url);

    const format = ytdl.chooseFormat(info.formats, {
      quality: "18"
    });

    res.json({
      downloadUrl: format.url
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Download error");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
