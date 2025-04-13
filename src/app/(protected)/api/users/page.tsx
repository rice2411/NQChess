"use client"

import { IApiDocumentationProps } from "@/types/api/apiEndpoint.interface"
import { useUserQueries } from "@/hooks/react-query/useUserQueries"
import { UserService } from "@/services/user.service"
import { useApiDocumentation } from "@/hooks/useApiDocumentation"
import ApiDocumentation from "@/components/features/apiDocumentation"
import { USER_QUERY_KEYS } from "@/constants/queryKey/userQueryKey"
import { USER_ENDPOINTS } from "@/constants/endpoint/userEndPointData"

export default function UsersApiDocumentation() {
  const {
    getUsersQuery,
    getUserByIdQuery,
    searchUserQuery,
    getUserByUsernameQuery,
    createOrUpdateMutation,
    deleteMutation,
  } = useUserQueries()

  const { handleExecute } = useApiDocumentation()

  const queries = {
    getUsers: getUsersQuery,
    getUserById: getUserByIdQuery,
    searchUser: searchUserQuery,
    getUserByUsername: getUserByUsernameQuery,
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
