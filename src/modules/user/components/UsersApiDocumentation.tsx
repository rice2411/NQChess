"use client"

import { IApiDocumentationProps } from "@/modules/documentation/api/interface/apiEndpoint.interface"
import { useUserQueries } from "@/modules/user/hooks/useUserQueries"
import { UserService } from "@/modules/user/services/user.service"
import { useApiDocumentation } from "@/modules/documentation/api/hooks/useApiDocumentation"
import ApiDocumentation from "@/modules/documentation/api/components"
import { USER_ENDPOINTS } from "@/modules/user/constants/userEndPointData"

export default function UsersApiDocumentation() {
  const {
    getAllQuery,
    getByIdQuery,
    getByUsernameQuery,
    createOrUpdateMutation,
    deleteMutation,
  } = useUserQueries()

  const { handleExecute } = useApiDocumentation()

  const queries = {
    getAll: getAllQuery,
    getById: getByIdQuery,
    getByUsername: getByUsernameQuery,
  }

  const mutations = {
    createOrUpdateUser: createOrUpdateMutation,
    deleteUser: deleteMutation,
  }

  const props: IApiDocumentationProps = {
    title: "Users API",
    endpoints: USER_ENDPOINTS,
    service: UserService,
    onExecute: (endpoint, params) =>
      handleExecute(
        endpoint,
        params,
        queries,
        mutations,
        //@ts-expect-error - endpoint.service is dynamically typed and USER_QUERY_KEYS is readonly
        USER_QUERY_KEYS[`${endpoint.service}`] || []
      ),
  }

  return <ApiDocumentation {...props} />
}
