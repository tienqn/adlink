class CreativeHelper {
  __creative;

  constructor(creative) {
    this._creative = creative;
  }

  withSize() {
    const [width, height] = this._creative.size.split("x");
    this._creative = {
      ...this._creative,
      width: parseInt(width) ?? 1,
      height: parseInt(height) ?? 1,
    };
    return this;
  }

  toHTML() {
    return this._creative.standard_code;
  }

  toHTMLFrame() {
    return `<!DOCTYPE html><html lang="en"><body>${this._creative.standard_code}</body></html>`;
  }

  toValue() {
    return {
      html: this.toHTML(),
      htmlFrame: this.toHTMLFrame(),
      size: this._creative.size,
      width: this._creative.width,
      height: this._creative.height,
    };
  }
}

module.exports = CreativeHelper;
