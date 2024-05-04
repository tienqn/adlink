const { syndicate_url, service_url } = require("../../configs/app");
const fs = require('node:fs');
const path = require("path");

function index(req, res) {
  let { domain } = req.params;
  let { cs, v } = req.query;
  let originUrl = req.headers.origin;

  if (typeof originUrl !== 'undefined') {
    res.set('Access-Control-Allow-Credentials', 'true');
    res.set('Access-Control-Allow-Origin', originUrl);
  } else {
    res.set('Access-Control-Allow-Origin', '*');
  }

  console.log('originUrl', originUrl);
  const date = new Date(),
    now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()),
    utc = new Date(now_utc),
    cb = new Date(utc.getTime() - (utc.getTimezoneOffset() * 60000)).toISOString().split("T")[0];

  const supply = {
    domain,
    serviceUrl: service_url,
    useStorage: true,
    clearStorage: new Boolean(cs || false),
  };

  let lib;
  try {
    lib = fs.readFileSync(path.join(__dirname, "../../storage/lib"), 'utf8');
  } catch (err) {
    console.error(err);
  }

  res.contentType("application/javascript");

  if (v === '2') { 
    return res.send(`window.adlinksite = ${JSON.stringify(supply)}; ${lib}`);
  }
  
  return res.send(`window.adlinksite = ${JSON.stringify(supply)};
(function (a, b, c) {
  if (a.getElementById(c)) return; 
  let d = a.getElementsByTagName(b)[0]; 
  a = a.createElement(b), a.id = c, a.async = true, a.type = "text/javascript", 
  a.src = "${syndicate_url}/javascript/adsbyadlink.js?cb=${cb}", 
  d && d.parentNode.insertBefore(a, d);}
)(document, "script", "adsbyadlink-jssdk");`);
}

module.exports = {
  index,
};
