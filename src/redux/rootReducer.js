import { combineReducers } from 'redux';

import { reducer as authReducer } from './auth';
import { reducer as translateReducer } from './translate';
import { reducer as settingsReducer } from './settings';
import { reducer as crudReducer } from './crud';
import { reducer as erpReducer } from './erp';
import { reducer as erpMultipleTabReducer } from './erpmultipletab';
import { reducer as crudConfiguration } from './configurations';
// Combine all reducers.

const rootReducer = combineReducers({
  auth: authReducer, 
  translate: translateReducer,
  settings: settingsReducer,
  crud: crudReducer,
  erp: erpReducer,
  erpMultipleTab: erpMultipleTabReducer,
  crudConfiguration: crudConfiguration
});

export default rootReducer;
