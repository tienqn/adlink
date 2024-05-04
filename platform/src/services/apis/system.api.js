import httpRequest from "@/services/httpRequest";

const systemApi = {
  // API for User
  getListUser(params = {}) {
    const url = Object.keys(params).length
        ? "v1/users?" + new URLSearchParams(params).toString()
        : "v1/users";
    return httpRequest.get(`${url}`);
  },
  getUserDetails(id, params = {}) {
    const url = Object.keys(params).length
        ? `v1/users/${id}?` + new URLSearchParams(params).toString()
        : `v1/users/${id}`;
    return httpRequest.get(url);
  },
  storeUser(body) {
    return httpRequest.post("v1/users", body);
  },
  updateUser(id, body) {
    return httpRequest.put(`v1/users/${id}`, body);
  },
  deleteUser(id) {
    return httpRequest.delete(`v1/users/${id}`);
  },

  // Role and permissions
  getListRole(body) {
    return httpRequest.get("v1/roles?per_page=-1&page=1&includes=permissions");
  },
  createRole(body) {
    return httpRequest.post("v1/roles", body);
  },
  updateRolePermissions(role_id, body) {
    return httpRequest.put(`v1/roles/${role_id}`, body);
  },
  getListPermission(body) {
    return httpRequest.get("v1/permissions?per_page=-1&page=1");
  },
  createPermission(body) {
    return httpRequest.post("v1/permissions", body);
  },
};

export default systemApi;
