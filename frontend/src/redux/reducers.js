// src/redux/reducers.js

import { SET_ITEMS, ADD_ITEM, UPDATE_ITEM, DELETE_ITEM, LOGIN, LOGOUT } from './actionTypes';

const initialState = {
  items: [],
  auth: {
    isAuthenticated: false,
    user: null,
  },
};

const mediaReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ITEMS:
      return { ...state, items: action.payload };
    case ADD_ITEM:
      return { ...state, items: [...state.items, action.payload] };
    case UPDATE_ITEM:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
      case LOGIN:
      return {
        ...state,
        auth: { isAuthenticated: true, user: action.payload },
      };
    case LOGOUT:
      return {
        ...state,
        auth: { isAuthenticated: false, user: null },
      };
    default:
      return state;
  }
};

export default mediaReducer;
