import axios from "axios";
import { toast } from "react-toastify";
import { BaseUrl } from "../constants/constant";
import queryString from 'query-string';
import Cookies from "js-cookie";
import { store } from "../redux/store";
import { logout } from "../redux/auth/authSlice";
const axiosInstance = axios.create({
  baseURL: BaseUrl.API_URL,
  headers: {
    Accept: "application/json",
  },
});

let verify = Cookies.get("authToken")


// Set the AUTH token for any request
axiosInstance.interceptors.request.use(function (config) {
  // const token = store.getState()?.auth?.user?.data?.data[0]?.token
  config.headers.Authorization = store?.getState()?.auth?.token ? store?.getState()?.auth?.token : verify ? verify : ""
  // config.headers.Authorization = verify ? verify : "" 

  console.log(verify, store?.getState()?.auth?.token, "verifyyyyyyyyyyyyyyyyyyy");
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      localStorage.clear();
      Cookies.remove('authToken')
      Cookies.remove('profileStatus')
      Cookies.remove('roleSelected')
      window.location.reload();
      // store.dispatch(logout());
      toast.warning("Session expired");
    }
    return Promise.reject(error?.response?.data);
  }
);

const axiosPost = (url, params = {}) => {
  return axiosInstance
    .post(url, params)
    .then((response) => {
      console.log(response, "sdddddddddddddddddddddddd");
      return { status: response.status, data: response.data };
    })
    .catch((err) => {
      console.log(err, "sdddddddddddddddddddddddd");
      const errorMessage = err?.response?.data?.msg || err?.errors[0]?.errorMessage || "Unknown error occurred";
      throw { status: err?.response?.status, msg: errorMessage };
    });
};

const axiosPut = (url, params = {}) => {
  return axiosInstance
    .put(url, params)
    .then((response) => {
      return { status: response.status, data: response.data };
    })
    .catch((err) => {
      const errorMessage = err?.response?.data?.msg || err?.errors[0]?.errorMessage || "Unknown error occurred";
      throw { status: err?.response?.status, msg: errorMessage };
    });
};

const axiosPostFormData = (url, params = {}) => {
  return axiosInstance
    .post(url, params, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((response) => {
      return { status: response.status, data: response.data };
    })
    .catch((err) => {
      const errorMessage = err?.response?.data?.msg || err?.errors[0]?.errorMessage || "Unknown error occurred";
      throw { status: err?.response?.status, msg: errorMessage };
    });
};

const axiosPatch = (url, params = {}) => {
  return axiosInstance
    .patch(url, params)
    .then((response) => {
      return { status: response.status, data: response.data };
    })
    .catch((err) => {
      const errorMessage = err?.response?.data?.msg || err?.errors[0]?.errorMessage || "Unknown error occurred";
      throw { status: err?.response?.status, msg: errorMessage };
    });
};

const axiosDelete = (url) => {
  return axiosInstance
    .delete(url)
    .then((response) => {
      return { status: response.status, data: response.data };
    })
    .catch((err) => {
      const errorMessage = err?.response?.data?.msg || err?.errors[0]?.errorMessage || "Unknown error occurred";
      throw { status: err?.response?.status, msg: errorMessage };
    });
};

const axiosGet = (url, params, flag) => {
  let query = queryString.stringify(params);
  // let newUrl = decodeURIComponent(query)
  return axiosInstance
    .get(url + '?' + query)
    .then((response) => {
      return { status: response.status, data: response.data };
    })
    .catch((err) => {
      const errorMessage = err?.response?.data?.msg || err?.errors[0]?.errorMessage || "Unknown error occurred";
      throw { status: err?.response?.status, msg: errorMessage };
    });
};

export const ApiClient = {
  post: axiosPost,
  postFormData: axiosPostFormData,
  patch: axiosPatch,
  delete: axiosDelete,
  get: axiosGet,
  put: axiosPut
};
