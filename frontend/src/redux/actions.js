import { SET_ITEMS, ADD_ITEM, UPDATE_ITEM, DELETE_ITEM, LOGIN, LOGOUT } from './actionTypes';

export const setItems = items => ({
  type: SET_ITEMS,
  payload: items,
});

export const addItem = item => ({
  type: ADD_ITEM,
  payload: item,
});

export const updateItem = item => ({
  type: UPDATE_ITEM,
  payload: item,
});

export const deleteItem = id => ({
  type: DELETE_ITEM,
  payload: id,
});

export const login = (user) => ({
  type: LOGIN,
  payload: user,
});

export const logout = () => ({
  type: LOGOUT,
});