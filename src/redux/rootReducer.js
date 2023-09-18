import {combineReducers} from 'redux';
import sendbirdReducer from './slices/sendbird';

// ----------------------------------------------------------------------

const rootReducer = combineReducers({
  sendbird: sendbirdReducer,
});

export {rootReducer};
