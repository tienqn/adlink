import httpRequest from "services/httpRequest";

const demandApi = {
  getListAdvertisers(params = {}) {
    const url = Object.keys(params).length
      ? "v1/advertisers?" + new URLSearchParams(params).toString()
      : "v1/advertisers";
    return httpRequest.get(`${url}`);
  },
  getListTypeAdvertisers(params = {}) {
    const url = Object.keys(params).length
      ? "v1/advertisers/types?" + new URLSearchParams(params).toString()
      : "v1/advertisers/types";
    return httpRequest.get(`${url}`);
  },
  storeAdvertiser(body) {
    return httpRequest.post("v1/advertisers", body);
  },

  // API for Order
  getListOrder(params = {}) {
    const url = Object.keys(params).length
      ? "v1/campaigns?" + new URLSearchParams(params).toString()
      : "v1/campaigns";
    return httpRequest.get(`${url}`);
  },
  getOrderDetails(id) {
    return httpRequest.get(`v1/campaigns/${id}`);
  },
  storeOrder(body) {
    return httpRequest.post("v1/campaigns", body);
  },
  updateOrder(id, body) {
    return httpRequest.put(`v1/campaigns/${id}`, body);
  },
  deleteOrder(id) {
    return httpRequest.delete(`v1/campaigns/${id}`);
  },

  // API for LineItem
  getListLineItem(params = {}) {
    const url = Object.keys(params).length
      ? "v1/ad-sets?" + new URLSearchParams(params).toString()
      : "v1/ad-sets";
    return httpRequest.get(`${url}`);
  },
  getLineItemDetails(id) {
    return httpRequest.get(`v1/ad-sets/${id}`);
  },
  storeLineItem(body) {
    return httpRequest.post("v1/ad-sets", body);
  },
  updateLineItem(id, body) {
    return httpRequest.put(`v1/ad-sets/${id}`, body);
  },
  deleteLineItem(id) {
    return httpRequest.delete(`v1/ad-sets/${id}`);
  },

  // API for Creative
  getListCreative(params = {}) {
    const url = Object.keys(params).length
      ? "v1/creatives?" + new URLSearchParams(params).toString()
      : "v1/creatives";
    return httpRequest.get(`${url}`);
  },
  getCreativeDetails(id) {
    return httpRequest.get(`v1/creatives/${id}`);
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

  // getListRole(body) {
  //   return httpRequest.get("v1/roles?per_page=-1&page=1&includes=permissions");
  // },
  // createRole(body: any) {
  //   return httpRequest.post("v1/roles", body);
  // },

  // updateRolePermissions(role_id, body) {
  //   return httpRequest.put(`v1/roles/${role_id}`, body);
  // },

  // getListPermission(body) {
  //   return httpRequest.get("v1/permissions?per_page=-1&page=1");
  // },
  // createPermission(body: any) {
  //   return httpRequest.post("v1/permissions", body);
  // },

  // register(body: { email: string, password: string }) {
  //   return httpRequest.post(URL_REGISTER, body);
  // },
};

export default demandApi;
