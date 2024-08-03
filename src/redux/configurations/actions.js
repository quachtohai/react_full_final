import { CQRS_SERVER } from '../../config/serverApiConfig';
import * as actionTypes from './types';
import { requestConfiguration as request} from '@/request';

export const configuration = {
  resetState:
    (props = {}) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.CONFIGURATION_RESET_STATE,
      });
    },
  resetAction:
    ({ actionType }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.CONFIGURATION_RESET_ACTION,
        keyState: actionType,
        payload: null,
      });
    },
  currentItem:
    ({ data }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.CONFIGURATION_CURRENT_ITEM,
        payload: { ...data },
      });
    },
  currentAction:
    ({ actionType, data }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.CONFIGURATION_CURRENT_ACTION,
        keyState: actionType,
        payload: { ...data },
      });
    },
  list:
    ({ entity, options = { page: 1, items: 10 } }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.CONFIGURATION_REQUEST_LOADING,
        keyState: 'list',
        payload: null,
      });
     
      let data = await request.list({ entity, options });
      
      data.success = true;
      if (data.success === true) {
        const result = {
          items: data,
          pagination: {
            current: parseInt(0, 10),
            pageSize: data.pageSize,
            total: parseInt(0, 10),
          },
        };       
        dispatch({
          type: actionTypes.CONFIGURATION_REQUEST_SUCCESS,
          keyState: 'list',
          payload: result,
        });
      } else {
        dispatch({
          type: actionTypes.CONFIGURATION_REQUEST_FAILED,
          keyState: 'list',
          payload: null,
        });
      }
    },
  create:
    ({ entity, jsonData, withUpload = false }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.CONFIGURATION_REQUEST_LOADING,
        keyState: 'create',
        payload: null,
      });
      let data = null;
      if (withUpload) {
        data = await request.createAndUpload({ entity, jsonData });
      } else {
        data = await request.create({ entity, jsonData });
      }

      if (data.success === true) {
        dispatch({
          type: actionTypes.CONFIGURATION_REQUEST_SUCCESS,
          keyState: 'create',
          payload: data.result,
        });

        dispatch({
          type: actionTypes.CONFIGURATION_CURRENT_ITEM,
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.CONFIGURATION_REQUEST_FAILED,
          keyState: 'create',
          payload: null,
        });
      }
    },
  read:
    ({ entity, id }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.CONFIGURATION_REQUEST_LOADING,
        keyState: 'read',
        payload: null,
      });

      let data = await request.read({ entity, id });

      if (data.success === true) {
        dispatch({
          type: actionTypes.CONFIGURATION_CURRENT_ITEM,
          payload: data.result,
        });
        dispatch({
          type: actionTypes.CONFIGURATION_REQUEST_SUCCESS,
          keyState: 'read',
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.CONFIGURATION_REQUEST_FAILED,
          keyState: 'read',
          payload: null,
        });
      }
    },
  update:
    ({ entity, id, jsonData, withUpload = false }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.CONFIGURATION_REQUEST_LOADING,
        keyState: 'update',
        payload: null,
      });

      let data = null;

      if (withUpload) {
        data = await request.updateAndUpload({ entity, id, jsonData });
      } else {
        data = await request.update({ entity, id, jsonData });
      }

      if (data.success === true) {
        dispatch({
          type: actionTypes.CONFIGURATION_REQUEST_SUCCESS,
          keyState: 'update',
          payload: data.result,
        });
        dispatch({
          type: actionTypes.CONFIGURATION_CURRENT_ITEM,
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.CONFIGURATION_REQUEST_FAILED,
          keyState: 'update',
          payload: null,
        });
      }
    },

  delete:
    ({ entity, id }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.CONFIGURATION_RESET_ACTION,
        keyState: 'delete',
      });
      dispatch({
        type: actionTypes.CONFIGURATION_REQUEST_LOADING,
        keyState: 'delete',
        payload: null,
      });

      let data = await request.delete({ entity, id });

      if (data.success === true) {
        dispatch({
          type: actionTypes.CONFIGURATION_REQUEST_SUCCESS,
          keyState: 'delete',
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.CONFIGURATION_REQUEST_FAILED,
          keyState: 'delete',
          payload: null,
        });
      }
    },

  search:
    ({ entity, options = {} }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.CONFIGURATION_REQUEST_LOADING,
        keyState: 'search',
        payload: null,
      });

      let data = await request.search({ entity, options });

      if (data.success === true) {
        dispatch({
          type: actionTypes.CONFIGURATION_REQUEST_SUCCESS,
          keyState: 'search',
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.CONFIGURATION_REQUEST_FAILED,
          keyState: 'search',
          payload: null,
        });
      }
    },
};
