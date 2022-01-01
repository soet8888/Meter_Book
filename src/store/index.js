import { createStore } from 'redux';
import { userReducer } from './reducers';

let store = createStore(userReducer);

export default store;