const express = require("express");
const { syndicate_url } = require("../configs/app");
const router = express.Router();

router.get("/", (req, res) => {
  res.contentType("text/html");
  return res.send(`<!DOCTYPE html>
  <html lang="en">
  <body>
    <script async src="${syndicate_url}/yeah1-gamming.com.min.js" crossOrigin="anonymous"></script>
    <div class="adsbyadlink" id="adsbyadlink-running010807"></div>
    <script>     
      window.adsbyadlink = window.adsbyadlink || [];
      adsbyadlink.push({
       adunit: "running010807",
       sizes: [[300, 250], [300,600], 'out_of_page', [1, 1]],
      });
    </script>
    
     <script async src="${syndicate_url}/yeah1-gamming.com.min.js" crossOrigin="anonymous"></script>
    <div class="adsbyadlink" id="adsbyadlink-running010807-CREATIVE02"></div>
    <script>     
      window.adsbyadlink = window.adsbyadlink || [];
      adsbyadlink.push({
       adunit: "running010807",
       sizes: [[300, 250], [300,600], 'out_of_page', [1, 1]],
       creative: "CREATIVE02",
      });
    </script>
  </body>
  </html>`);
});

module.exports = router;