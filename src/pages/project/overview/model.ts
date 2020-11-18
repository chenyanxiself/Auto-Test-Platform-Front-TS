import { Reducer } from 'umi';
import { ColumnsInfo, ProgressInfo } from './data';

export interface ModelState {
  columnsList: ColumnsInfo[];
  trigger: boolean;
  progress: ProgressInfo;
}

export interface ModelType {
  namespace: 'overview';
  state: ModelState;
  reducers: {
    setColumnsList: Reducer<ModelState>;
    setTrigger: Reducer<ModelState>;
    setProgress: Reducer<ModelState>;
  };
}

const Model: ModelType = {
  namespace: 'overview',
  state: {
    columnsList: [],
    trigger: true,
    progress: {
      total: 0,
      finish: 0,
    },
  },
  reducers: {
    setColumnsList(state, action) {
      return { ...state, columnsList: action.payload };
    },
    setTrigger(state, action) {
      return { ...state, trigger: !state.trigger };
    },
    setProgress(state, action) {
      return { ...state, progress: action.payload };
    },
  },
};
export default Model;
