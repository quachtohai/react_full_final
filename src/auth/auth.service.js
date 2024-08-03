import { CQRS_SERVER } from "@/config/serverApiConfig";

import axios from "axios";
import errorHandler from "@/request/errorHandler";
import successHandler from "@/request/successHandler";

export const login = async ({ loginData }) => {
  try {
    axios.defaults.baseURL = CQRS_SERVER;
    axios.defaults.withCredentials = false;
    const response = await axios.post(
      CQRS_SERVER + `/userinfologin/search/`,
      loginData
    );
    const { data } = response;
    successHandler(
      { data },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );
    return data.results;
  } catch (error) {
    return errorHandler(error);
  }
};

export const register = async ({ registerData }) => {
  try {
    const response = await axios.post(CQRS_SERVER + `register`, registerData);

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const verify = async ({ userId, emailToken }) => {
  try {
    const response = await axios.get(
      CQRS_SERVER + `verify/${userId}/${emailToken}`
    );

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const resetPassword = async ({ resetPasswordData }) => {
  try {
    const response = await axios.post(
      CQRS_SERVER + `resetpassword`,
      resetPasswordData
    );

    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};
export const logout = async () => {
  axios.defaults.withCredentials = true;
  var result = window.localStorage.getItem("auth");
  let loginData = JSON.parse(result);
  
  try {
    
    axios.defaults.baseURL = CQRS_SERVER;
    axios.defaults.withCredentials = false;
    const response = await axios.post(
      CQRS_SERVER + `/userinfologin/search/`,
      loginData.current
    );
    debugger;
    const { data } = response;

    successHandler(
      { data },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );
    return data.results;
  } catch (error) {
    return errorHandler(error);
  }
};
