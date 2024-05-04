import httpRequest from "@/services/httpRequest";

const studentManagementApi = {

  // api for student
  getListStudent(params = {}) {
    const url = Object.keys(params).length
      ? "v1/students?" + new URLSearchParams(params).toString()
      : "v1/students";
    return httpRequest.get(`${url}`);
  },

  storeStudent(body) {
    return httpRequest.post("v1/students", body);
  },
};

export default studentManagementApi;
