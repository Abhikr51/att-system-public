//Packages
import { applyMiddleware, combineReducers, legacy_createStore as createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
//Reducers
import AuthReducer from './reducers/AuthReducer';




const store = combineReducers({
  auth : AuthReducer,

}); 
const middlewareStore = applyMiddleware (ReduxThunk)(createStore)
export default middlewareStore(store,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() );

