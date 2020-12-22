export interface ColumnsInfo {
  id: number;
  title: string;
  taskList: TaskInfo[];

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
  priority: number,
  follower?: number[],
  description?: string,

  [name: string]: any;
}

export interface ProgressInfo {
  finish: number;
  total: number;
}
