export const LocalStorageEventTarget = new EventTarget();

export const setAccessTokenToLS = (access_token) => {
  localStorage.setItem("access_token", access_token);
};
export const getAccessTokenFromLS = () =>
  localStorage.getItem("access_token") || "";

export const setTokenExpiredToLS = (token_expires) => {
  localStorage.setItem("token_expires", token_expires);
};
export const getTokenExpiredFromLS = () =>
  localStorage.getItem("token_expires") || "";

export const setProfileToLS = (profile) => {
  localStorage.setItem("profile", JSON.stringify(profile));
};
export const getProfileFromLS = () => {
  const result = localStorage.getItem("profile");
  return result ? JSON.parse(result) : null;
};

export const clearLS = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token_expires");
  localStorage.removeItem("profile");
  localStorage.removeItem("redux-root");
  const clearLSEvent = new Event("clearLS");
  LocalStorageEventTarget.dispatchEvent(clearLSEvent);
};

export const setRefreshTokenToLS = (refresh_token) => {
  localStorage.setItem("refresh_token", refresh_token);
};
export const getRefreshTokenFromLS = () =>
  localStorage.getItem("refresh_token") || "";
