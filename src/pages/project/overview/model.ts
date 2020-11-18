import { Reducer } from 'umi';
import { ColumnsInfo } from './data';

export interface ModelState {
  columnsList: ColumnsInfo[]
  trigger: boolean
}

export interface ModelType {
  namespace: 'overview';
  state: ModelState;
  reducers: {
    setColumnsList: Reducer<ModelState>,
    setTrigger: Reducer<ModelState>
  };
}

const Model: ModelType = {
  namespace: 'overview',
  state: {
    columnsList: [],
    trigger: true,
  },
  reducers: {
    setColumnsList(state, action) {
      return { ...state, columnsList: action.payload };
    },
    setTrigger(state, action) {
      return { ...state, trigger: !state.trigger };
    },
  },
};
export default Model;
