export interface RequestHost{
  isUseEnv: boolean,
  requestHost: string,
  envHost: string|undefined,
  realHost: string,
}

export interface ApiCaseInfo{
  id:number
  caseName:string
  requestMehod:number
  requestPath:string
  requestHost:RequestHost
  requestHeaders:any
  requestQuery:any
  requestBody:any
}