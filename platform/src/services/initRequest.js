import axios from "axios";
import {
  clearLS,
  getAccessTokenFromLS,
  setAccessTokenToLS,
  setProfileToLS,
} from "./auth.service.js";
// import { setIsAuthenticated } from "redux/slices/app";
import {toast} from "react-toastify";

const URL_LOGIN = "v1/auth/login";
const URL_LOGOUT = "v1/auth/logout";
const URL_REGISTER = "v1/auth/register";

const requestConfig = {
  baseURL: 'http://localhost:8080',
  // baseURL: process.env.REACT_APP_BASE_URL,
    // baseURL:"https://platform-api.adlinknetwork.vn",
  timeout: 25000,
  headers: {
    "Content-Type": "application/json",
  },
  showSpinner: false,
};

export const axiosInstance = axios.create(requestConfig);

const { CancelToken } = axios;
// let cancel = null;

export default function initRequest(store) {
  let requestCount = 0;

  function decreaseRequestCount() {
    requestCount -= 1;
    if (requestCount === 0) {
      // store.dispatch(updateIsLoadingApp(false));
    }
  }

  axiosInstance.interceptors.request.use(
    (config) => {
      // cancel token
      // if (cancel) {
      //   cancel(); // cancel request
      // }

      config.cancelToken = new CancelToken(function executor(c) {
        // cancel = c;
      });

      // show loading
      if (config?.showSpinner) {
        requestCount += 1;
        // store.dispatch(updateIsLoadingApp(true));
      }

      // add x-auth-token
      const accessToken = getAccessTokenFromLS();
      const isAuthRequest =
        config.url === URL_LOGIN ||
        config.url === URL_REGISTER ||
        config.url === URL_LOGOUT;

      if (!isAuthRequest) {
        // clearLS(); // LOGOUT
      }

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      if (error?.config?.showSpinner) {
        decreaseRequestCount();
      }
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      if (response?.config?.showSpinner) {
        decreaseRequestCount();
      }

      const { url } = response.config;
      if (url === URL_LOGIN) {
        const data = response?.data?.data;
        const accessToken = data?.access_token;
        setAccessTokenToLS(accessToken);
        setProfileToLS(data?.user);
      } else if (url === URL_LOGOUT) {
        // clearLS();
      }

      return response?.data || response;
    },
    (error) => {
      const statusCode = error?.response?.status;
      const isTokenExpired = statusCode === 401;

      if (isTokenExpired) {
        clearLS();
        window.location.href = `${window.location.origin}/auth/login`;
      }
        const requestURL = error?.request?.responseURL;
        const isShowToast = urlShowErrorDetail.filter(url=> requestURL.includes(url)).length>0?true:false;
        if(!isShowToast) {
            handleResponseError(error);
        }
      return Promise.reject(error?.response?.data || error);
    }
  );
}

const handleResponseError = (error) => {
    const dataError = error.response?.data;
    const message = dataError?.messages || dataError.message;

    switch (error.response?.status) {
        case 422: {
            const messages = dataError?.messages;
            let messageToast1 = 'Invalid input';

            const isArray = Array.isArray(messages);
            if(isArray) {
                const isString = typeof messages[0] === 'string';
                messageToast1 = isString ? messages[0] :'Invalid input';
            } else {
                messageToast1 =  Object.values(messages)?.[0]?.[0] || 'Invalid input';
            }
            toast.error(messageToast1);
            break;
        }
        default:
            const messageToast2 = dataError?.message ||'Something went error';
            toast.error(messageToast2);
            break;
    }
};

const urlShowErrorDetail = [
    "sites/verify-ads-txt"
]
