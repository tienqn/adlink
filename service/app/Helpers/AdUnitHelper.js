const phpUnserialize = require("phpunserialize");

class AdUnitHelper {
  _cacheValue;

  constructor(cacheValue) {
    this._cacheValue = cacheValue;
  }

  unserialize() {
    try {
      return phpUnserialize(this._cacheValue);
    } catch ( e ) {
      return null;
    }
  }
}

module.exports = AdUnitHelper;
