const express = require("express");
const path = require("path");
const router = express.Router();

const SyndicateController = require("../app/Controllers/SyndicateController");
const { env } = require("../configs/app");

router.get("/:domain.min.js", SyndicateController.index);

module.exports = router;
