import * as actionTypes from "./types";
import * as authService from "@/auth";
import { request } from "@/request";

export const login =
  ({ loginData }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const data = await authService.login({ loginData });
    debugger;
    if (data.tokenString) {
      const auth_state = {
        current: data,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };
      window.localStorage.setItem("auth", JSON.stringify(auth_state));
      window.localStorage.removeItem("isLogout");
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };

export const register =
  ({ registerData }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const data = await authService.register({ registerData });

    if (data.success === true) {
      dispatch({
        type: actionTypes.REGISTER_SUCCESS,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };

export const verify =
  ({ userId, emailToken }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const data = await authService.verify({ userId, emailToken });

    if (data.success === true) {
      const auth_state = {
        current: data.result,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };
      window.localStorage.setItem("auth", JSON.stringify(auth_state));
      window.localStorage.removeItem("isLogout");
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };

export const resetPassword =
  ({ resetPasswordData }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const data = await authService.resetPassword({ resetPasswordData });

    if (data.success === true) {
      const auth_state = {
        current: data.result,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };
      window.localStorage.setItem("auth", JSON.stringify(auth_state));
      window.localStorage.removeItem("isLogout");
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };

export const logout = () => async (dispatch) => {
 
  const data = await authService.logout();
  data.success = true;
  if (data.success === false) {    
    
    window.localStorage.setItem("settings", JSON.stringify(tmpSettings));
    window.localStorage.removeItem("isLogout");
    dispatch({
      type: actionTypes.LOGOUT_FAILED,
      payload: data.result,
    });
  } else {
    const result = window.localStorage.getItem("auth");
    const tmpAuth = JSON.parse(result);
    const settings = window.localStorage.getItem("settings");
    const tmpSettings = JSON.parse(settings);
    window.localStorage.removeItem("auth");
    window.localStorage.removeItem("settings");
    window.localStorage.setItem("isLogout", JSON.stringify({ isLogout: true }));
    dispatch({
      type: actionTypes.LOGOUT_SUCCESS,
    });
  }
};

export const updateProfile =
  ({ entity, jsonData }) =>
  async (dispatch) => {
    let data = await request.updateAndUpload({ entity, id: "", jsonData });

    if (data.success === true) {
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data.result,
      });
      const auth_state = {
        current: data.result,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };
      window.localStorage.setItem("auth", JSON.stringify(auth_state));
    }
  };
