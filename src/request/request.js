import axios from 'axios';
import { API_BASE_URL, CQRS_SERVER } from '@/config/serverApiConfig';

import entityandRoute from '../config/entityandRoute';
import errorHandler from './errorHandler';
import successHandler from './successHandler';
import { orderData } from '../data/orderData';
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = false;

const request = {

  create: async ({ entity, jsonData }) => {
    try {
      console.log(jsonData);
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      const response = await axios.post(entity + '/create', jsonData);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  createAndUpload: async ({ entity, jsonData }) => {
    try {
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      const response = await axios.post(entity + '/create', jsonData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  read: async ({ entity, id }) => {
    try {
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      const response = await axios.get(entity + '/read/' + id);

      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      });

      var dataFinal = {};
      dataFinal.result = response.data.results;
      dataFinal.message = response.data.results.message;
      dataFinal.success = response.data.results.success;
      return dataFinal;

      //return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  update: async ({ entity, id, jsonData }) => {
    try {
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      jsonData.Id = id;
      const response = await axios.put(entity + '/update/', jsonData);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  updateAndUpload: async ({ entity, id, jsonData }) => {
    try {
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      const response = await axios.patch(entity + '/update/' + id, jsonData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  delete: async ({ entity, id }) => {
    try {
     
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      const response = await axios.delete(entity + '/delete/' + id);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      console.log(response);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  filter: async ({ entity, options = {} }) => {
    try {
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      let filter = options.filter ? 'filter=' + options.filter : '';
      let equal = options.equal ? '&equal=' + options.equal : '';
      let query = `?${filter}${equal}`;

      const response = await axios.get(entity + '/filter' + query);
      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  search: async ({ entity, options = {} }) => {
    try {
      //CQRS_SERVER = "http://localhost:7000/"
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      let query = '?';
      for (var key in options) {
        query += key + '=' + options[key] + '&';
      }
      query = query.slice(0, -1);
      const response = await axios.get(entity + '/search' + query);

      successHandler(response.data.results, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      //return response.data;
      return response.data.results;
    } catch (error) {
      return errorHandler(error);
    }

  },

  list: async ({ entity, options = {}, optionsDate = {} }) => {
    try {
      
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      let query = '?';
      for (var key in options) {
        query += key + '=' + options[key] + '&';
      }
      query = query.slice(0, -1);
      let queryDate = "&"
      for (var keyDate in optionsDate) {
        if (optionsDate[keyDate])
          queryDate += keyDate + '=' + optionsDate[keyDate] + '&'
      }
      let queryFinal = query + queryDate == "&" ? "" : query + queryDate;
      const response = await axios.get(entity + '/list' + queryFinal);
      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      if (response.data.results) {

        response.data.results.result = response.data.results.data;
        return response.data.results;
      } else {
        return response.data;
      }
    } catch (error) {
      return errorHandler(error);
    }
  },
  listWithDetails: async ({ entity, options = {} }) => {
    try {
      let query = '?';

      for (var key in options) {
        query += key + '=' + options[key] + '&';
      }
      query = query.slice(0, -1);
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      const response = await axios.get(entity + '/list' + query);
      const responseMock = orderData;

      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return responseMock;
    } catch (error) {
      return errorHandler(error);
    }
  },
  listAll: async ({ entity, options = {} }) => {
    try {
      let query = '?';
      for (var key in options) {
        query += key + '=' + options[key] + '&';
      }
      query = query.slice(0, -1);
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;

      const response = await axios.get(entity + '/listAll' + query);

      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  post: async ({ entity, jsonData }) => {
    try {
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      const response = await axios.post(entity, jsonData);

      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  get: async ({ entity }) => {
    try {
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      const response = await axios.get(entity);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  patch: async ({ entity, jsonData }) => {
    try {
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      const response = await axios.patch(entity, jsonData);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  upload: async ({ entity, id, jsonData }) => {
    try {
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      const response = await axios.patch(entity + '/upload/' + id, jsonData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  source: () => {
    axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
    axios.defaults.withCredentials = false;
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    return source;
  },

  summary: async ({ entity, options = {} }) => {
    try {
      let query = '?';
      for (var key in options) {
        query += key + '=' + options[key] + '&';
      }
      query = query.slice(0, -1);
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      const response = await axios.get(entity + '/summary' + query);

      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });

      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  mail: async ({ entity, jsonData }) => {
    try {
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      const response = await axios.post(entity + '/mail/', jsonData);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  convert: async ({ entity, id }) => {
    try {
      axios.defaults.baseURL = CQRS_SERVER + entityandRoute(entity);
      axios.defaults.withCredentials = false;
      const response = await axios.get(`${entity}/convert/${id}`);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
};
export default request;
