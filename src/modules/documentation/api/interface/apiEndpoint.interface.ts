import {
  ISuccessResponse,
  IErrorResponse,
} from "../../../../core/types/api/response.interface"

export interface IParameter {
  name: string
  type: string
  required: boolean
  description: string
  value?: any
}

export interface IEndpoint {
  method: string
  service: string
  description: string
  parameters: Record<string, IParameter>
}
export interface IApiDocumentationProps {
  title: string
  endpoints: IEndpoint[]
  service: Record<string, (...args: any[]) => Promise<any>>
  onExecute: (
    endpoint: IEndpoint,
    params: Record<string, any>
  ) => Promise<ISuccessResponse<any> | IErrorResponse>
}
