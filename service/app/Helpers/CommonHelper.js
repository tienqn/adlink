const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch ( error ) {
    return false;
  }
};


const getDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch ( error ) {
    return null;
  }
};

module.exports = {
  isValidUrl,
  getDomain,
};
