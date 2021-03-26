export interface Case {
  id: number;
  name: string;
  moduleId: number;
  priority: number;
  precondition: string;
  remark: string;
  steps: any;

  [name: string]: any;
}

export interface CaseModule {
  id: number;
  name: string;
  parentId: number;

  [name: string]: any;
}

export interface CaseDetailInfo {
  id: number;
  name: string;
  modules: string[];
  priority: number;
  precondition: string;
  remark: string;
  steps: any;
  creator: string;

  [name: string]: any;
}
