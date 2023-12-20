const express = require("express");
const cache = require("memory-cache");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

// Endpoint to get a cached file
app.get("/getfile", (req, res) => {
  // Check if the file is in the cache
  const filename = path.join(__dirname, "demo.bin");
  const cachedFile = cache.get(filename);

  if (cachedFile) {
    // If the file is in the cache, send it directly
    res.writeHead(200, {
      "Content-Type": "video/mp4",
      "Content-Length": cachedFile.length,
    });

    res.end(cachedFile, "binary");
  } else {
    fs.readFile(filename, (err, data) => {
      if (err) {
        console.error(`Error reading file ${filename}: ${err.message}`);
        res.status(500).send("Internal Server Error");
      } else {
        console.log(`File ${filename} read from disk and cached.`);
        cache.put(filename, data, 300000); // Cache for 5 minutes (300,000 milliseconds)

        res.writeHead(200, {
          "Content-Type": "video/mp4",
          "Content-Length": data.length,
        });

        res.end(data, "binary");
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
