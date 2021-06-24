export interface RequestHost {
  isUseEnv: boolean;
  envHost: string | undefined;
}

export interface ApiCaseInfo {
  id: number;
  suiteId: number;
  caseName: string;
  requestMehod: number;
  requestUrl: string;
  requestHost: RequestHost;
  requestHeaders: any;
  requestQuery: any;
  requestBody: any;
}

export interface SuiteInfo {
  id: number;
  title: string;
}
