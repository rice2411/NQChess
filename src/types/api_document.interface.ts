export interface IParrameter {
  type: string;
  required: boolean;
  description: string;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  value?: any;
}
export interface IEndpoint {
  method: string;
  service: string;
  description: string;
  parameters: Record<string, IParrameter>;
}

export interface IApiDocumentationProps {
  title: string;
  endpoints: IEndpoint[];
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  service: Record<string, (...args: any[]) => Promise<any>>;
}
