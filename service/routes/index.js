const express = require("express");
const router = express.Router();

const AdUnitController = require("../app/Controllers/AdUnitController");

router.get("/:ad_unit_code.json", AdUnitController.index);

module.exports = router;
