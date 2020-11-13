import { Reducer, Subscription } from 'umi';
import { CaseModule } from './data';

export interface GlobalModelState {
  selectedModule: Partial<CaseModule>
  moduleTree: CaseModule[]
}

export interface GlobalModelType {
  namespace: 'case';
  state: GlobalModelState;
  reducers: {
    setSelectedModule: Reducer<GlobalModelState>,
    setModuleTree: Reducer<GlobalModelState>,
  };
}

const GlobalModel: GlobalModelType = {
  namespace: 'case',
  state: {
    selectedModule: {},
    moduleTree: [],
  },
  reducers: {
    setSelectedModule(state, action) {
      return { ...state, selectedModule: action.payload };
    },
    setModuleTree(state, action) {
      return { ...state, moduleTree: action.payload };
    },
  },
};
export default GlobalModel;
