

import { createStore } from 'redux';
import mediaReducer from './reducers';

const store = createStore(mediaReducer);

export default store;
