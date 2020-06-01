import { useReducer } from 'react';

import { State } from "./State";
import { ApiStatus } from "./ApiStatus";
import Reducer from './Reducer';

const initialState: State = {
  apiStatus: ApiStatus.Unitialized,
  images: [],
  filterPattern: ''
};

const reducer = new Reducer().reducer();

export default () => useReducer(reducer, initialState);
export { ApiStatus } from "./ApiStatus";
