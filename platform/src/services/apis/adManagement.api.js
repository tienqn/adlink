import httpRequest from "@/services/httpRequest";

const adManagementApi = {
  // API for Creative
  getListCreative(params = {}) {
    const url = Object.keys(params).length
      ? "v1/creatives?" + new URLSearchParams(params).toString()
      : "v1/creatives";
    return httpRequest.get(`${url}`);
  },
  getCreativeDetails(id, params = {}) {
    const url = Object.keys(params).length
      ? `v1/creatives/${id}?` + new URLSearchParams(params).toString()
      : `v1/creatives/${id}`;
    return httpRequest.get(url);
  },
  storeCreative(body) {
    return httpRequest.post("v1/creatives", body);
  },
  updateCreative(id, body) {
    return httpRequest.put(`v1/creatives/${id}`, body);
  },
  deleteCreative(id) {
    return httpRequest.delete(`v1/creatives/${id}`);
  },

  storeLineItem(body) {
    return httpRequest.post("v1/line-items", body);
  },
  updateLineItem(id, body) {
    return httpRequest.put(`v1/line-items/${id}`, body);
  },

  // api for category
  getListCategorie(params = {}) {
    const url = Object.keys(params).length
      ? "v1/categories?" + new URLSearchParams(params).toString()
      : "v1/categories";
    return httpRequest.get(`${url}`);
  },

  // api for site
  getListSite(params = {}) {
    const url = Object.keys(params).length
      ? "v1/sites?" + new URLSearchParams(params).toString()
      : "v1/sites";
    return httpRequest.get(`${url}`);
  },
  getSiteDetails(id, params = {}) {
    const url = Object.keys(params).length
      ? `v1/sites/${id}?` + new URLSearchParams(params).toString()
      : `v1/sites/${id}`;
    return httpRequest.get(url);
  },
  storeSite(body) {
    return httpRequest.post("v1/sites", body);
  },
  updateSite(id, body) {
    return httpRequest.put(`v1/sites/${id}`, body);
  },
  verifyAdsTxt(id) {
    return httpRequest.get(`v1/sites/verify-ads-txt/${id}`);
  },

  // api for ad unit
  getListAdUnit(params = {}) {
    const url = Object.keys(params).length
      ? "v1/ad-units?" + new URLSearchParams(params).toString()
      : "v1/ad-units";
    return httpRequest.get(`${url}`);
  },
  getAdUnitDetails(id, params = {}) {
    const url = Object.keys(params).length
      ? `v1/ad-units/${id}?` + new URLSearchParams(params).toString()
      : `v1/ad-units/${id}`;
    return httpRequest.get(url);
  },
  storeAdUnit(body) {
    return httpRequest.post("v1/ad-units", body);
  },
  updateAdUnit(id, body) {
    return httpRequest.put(`v1/ad-units/${id}`, body);
  },
  assignCreativeToAdUnit(id, body) {
    return httpRequest.put(`v1/ad-units/${id}/assign`, body);
  },
  deleteAdUnit(id) {
    return httpRequest.delete(`v1/ad-units/${id}`);
  },
};

export default adManagementApi;
