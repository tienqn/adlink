require('dotenv').config();
module.exports = {
  env: process.env.APP_ENV || "local",
  service_url: process.env.SERVICE_URL || "",
  syndicate_url: process.env.SYNDICATION_URL || "",
};
