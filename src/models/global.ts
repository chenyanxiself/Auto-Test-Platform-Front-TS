import { Reducer } from 'umi';

export interface GlobalModelState {
  id: number
  name: string
  cname: string
  email?: string
  phone?: string
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  reducers: {
    setCurrentUser: Reducer<GlobalModelState>;
  };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',
  state: {
    id: 0,
    name: '',
    cname: '',
    email: '',
    phone: '',
  },
  reducers: {
    setCurrentUser(state, action) {
      return action.payload;
    },
  },
};
export default GlobalModel;
