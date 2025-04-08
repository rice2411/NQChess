import { CLASS_ENDPOINTS } from "@/services/class/class.endpoint.sample";
import { ClassService } from "@/services/class/class.service";
import { useClassQueries } from "@/hooks/react-query/class/useClassQueries";
import { IApiDocumentationProps } from "@/types/api/api.endpoints.interface";
import ApiDocumentation from "@/components/api-documentation";
import { useApiDocumentation } from "@/hooks/useApiDocumentation";
import { CLASS_QUERY_KEYS } from "@/hooks/react-query/class/class-query-key";
export default function ClassApiDocumentation() {
  const {
    getClassesQuery,
    getClassByIdQuery,
    createMutation,
    addStudentsMutation,
    deleteMutation,
  } = useClassQueries();

  const { handleExecute } = useApiDocumentation();

  const queries = {
    getClasses: getClassesQuery,
    getClassById: getClassByIdQuery,
  };

  const mutations = {
    createClass: createMutation,
    addStudentsToClass: addStudentsMutation,
    deleteClass: deleteMutation,
  };

  const props: IApiDocumentationProps = {
    title: "Class API",
    endpoints: CLASS_ENDPOINTS,
    service: ClassService,
    onExecute: (endpoint, params) =>
      handleExecute(
        endpoint,
        params,
        queries,
        mutations,
        //@ts-expect-error - endpoint.service is dynamically typed and CLASS_QUERY_KEYS is readonly
        CLASS_QUERY_KEYS[`${endpoint.service}`] || []
      ),
  };

  return <ApiDocumentation {...props} />;
}
