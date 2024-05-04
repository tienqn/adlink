import { axiosInstance } from "./initRequest";

class HttpRequest {
  //   let api;
  constructor() {
    this.api = axiosInstance;
  }
  // async get(url: string, config?: IConfig) {
  //   return this.api.get(url, config);
  // }
}

const httpInstance = new HttpRequest();
const httpRequest = httpInstance.api;

export default httpRequest;
