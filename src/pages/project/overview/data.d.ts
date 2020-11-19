export interface ColumnsInfo {
  id: number
  title: string
  taskList: TaskInfo[]

  [name: string]: any
}

export interface TaskInfo {
  id: number
  title: string
  status: number | undefined
  sort?: number
  creator: {
    id: number,
    cname: string
    [name: string]: any
  }

  [name: string]: any
}

export interface ProgressInfo {
  finish: number
  total: number
}
