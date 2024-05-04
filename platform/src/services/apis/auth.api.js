import httpRequest from "@/services/httpRequest";

export const URL_LOGIN = "v1/auth/login";
export const URL_REGISTER = "v1/auth/register";
export const URL_LOGOUT = "v1/auth/logout";

const authApi = {
  login(body) {
    return httpRequest.post(URL_LOGIN, body);
  },

  getProfile(params) {
    const url = Object.keys(params).length
      ? "v1/auth/me?" + new URLSearchParams(params).toString()
      : "v1/auth/me";
    return httpRequest.get(url);
  },

  refresh() {
    return httpRequest.get(`v1/auth/refresh`);
  },
};

export default authApi;
