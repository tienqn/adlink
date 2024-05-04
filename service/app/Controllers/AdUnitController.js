const AdUnitHelper = require("../Helpers/AdUnitHelper");
const CreativeHelper = require("../Helpers/CreativeHelper");

const redis = require("../Services/RedisService");

const {redis_keys} = require("../../configs/cache");
const LineItemHelper = require("../Helpers/LineItemHelper");

async function index(req, res) {
    let {ad_unit_code} = req.params;
    let {sizes} = req.query;

    let cacheKey = `${redis_keys.adunit}${ad_unit_code}`;
    const cacheValue = await redis.get(cacheKey);
    console.log('cacheValue', cacheValue)
    if (!cacheValue) {
        return res.json([]);
    }
    const adUnitHelper = new AdUnitHelper(cacheValue);
    let adUnit = adUnitHelper.unserialize();
    if (!adUnit) {
        return res.json([]);
    }

    if (!adUnit.line_items) {
        return res.json([]);
    }

    // Filter Line Items
    const lineItemHelper = new LineItemHelper(adUnit.line_items);
    lineItemHelper.filterByStartEnd();

    let creatives = lineItemHelper.creatives();

    if (sizes) {
        sizes = sizes.split(",");
        // remove duplicate sizes
        sizes = [...new Set(sizes)];

        creatives = Object.fromEntries(
            Object.entries(creatives).filter(
                ([key, val]) => sizes.includes(val.size),
            ),
        );
    }

    Object.keys(creatives).forEach(function (key, index) {
        let creative = creatives[key];
        creative = new CreativeHelper(creative).withSize();
        creatives[key] = creative.toValue();
    });

    return res.json(creatives);
}

module.exports = {
    index,
};
