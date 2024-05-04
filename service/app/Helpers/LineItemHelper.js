class LineItemHelper {
    _lineItems;

    constructor(lineItems) {
        this._lineItems = lineItems;
    }

    toValue() {
        return this._lineItems;
    }

    creatives() {
        const creatives = {};
        this._lineItems.forEach((item) => {
            item.creatives.forEach((creative) => {
                creatives[creative.code] = creative;
            });
        });

        return creatives;
    }

    filterByStartEnd() {
        const date = new Date(),
            utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());

        this._lineItems = this._lineItems.filter((item) => {
            if ( item.delivery_settings ) {
                return item.delivery_settings.start <= utc && item.delivery_settings.end >= utc;
            }
            return true;
        });

        return this;
    }
}

module.exports = LineItemHelper;