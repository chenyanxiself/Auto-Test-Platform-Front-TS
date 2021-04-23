export interface ColumnsInfo {
  id: number;
  title: string;
  taskList: TaskInfo[];
  sort: number;

  [name: string]: any;
}

export interface TaskInfo {
  id: number;
  title: string;
  status: number | undefined;
  sort?: number;
  creator: {
    id: number;
    cname: string;
    [name: string]: any;
  };
  priority: number;
  follower?: number[];
  description?: string;
  img?: number[];

  [name: string]: any;
}

export interface ProgressInfo {
  finish: number;
  total: number;
}
