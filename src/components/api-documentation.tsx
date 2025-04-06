"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IErrorResponse, ISuccessResponse } from "@/types/response.interface";
import { Textarea } from "@/components/ui/textarea";
import { CopyIcon } from "lucide-react";
import {
  IApiDocumentationProps,
  IEndpoint,
  IParrameter,
} from "@/types/api_document.interface";

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":
      return "bg-green-100 text-green-800";
    case "POST":
      return "bg-blue-100 text-blue-800";
    case "PUT":
      return "bg-yellow-100 text-yellow-800";
    case "DELETE":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function ApiDocumentation({
  title,
  endpoints,
  service,
}: IApiDocumentationProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<IEndpoint | null>(
    null
  );
  const [jsonData, setJsonData] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleExecute = async () => {
    if (!selectedEndpoint) return;

    setIsLoading(true);
    try {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      let result: ISuccessResponse<any> | IErrorResponse;

      if (!service[selectedEndpoint.service]) {
        result = {
          success: false,
          errorCode: "INVALID_ENDPOINT",
          message: `Method ${selectedEndpoint.service} not found in service`,
        };
      } else {
        let data;
        try {
          data = jsonData ? JSON.parse(jsonData) : {};
        } catch {
          result = {
            success: false,
            errorCode: "INVALID_JSON",
            message: "Invalid JSON data",
          };
          setResponse(JSON.stringify(result, null, 2));
          return;
        }

        try {
          if (selectedEndpoint.method === "GET") {
            if (selectedEndpoint.service === "searchStudent") {
              const { fullName, dateOfBirth, phoneNumber, isBeutifyDate } =
                data;
              result = await service[selectedEndpoint.service](
                fullName,
                dateOfBirth,
                phoneNumber,
                isBeutifyDate
              );
            } else {
              const params = Object.keys(selectedEndpoint.parameters).reduce(
                (acc, key) => {
                  if (data[key] !== undefined) {
                    acc[key] = data[key];
                  }
                  return acc;
                },
                {} as Record<string, any>
              );
              result = await service[selectedEndpoint.service](params);
            }
          } else if (selectedEndpoint.method === "DELETE") {
            const id = data.id;
            if (!id) {
              result = {
                success: false,
                errorCode: "MISSING_ID",
                message: "ID is required for DELETE operation",
              };
            } else {
              result = await service[selectedEndpoint.service](id);
            }
          } else {
            result = await service[selectedEndpoint.service](data);
          }
        } catch (error) {
          result = {
            success: false,
            errorCode: "API_ERROR",
            message:
              error instanceof Error ? error.message : "Unknown error occurred",
          };
        }
      }

      setResponse(JSON.stringify(result, null, 2));
    } catch (error) {
      setResponse(JSON.stringify(error, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const renderParameters = (parameters: Record<string, IParrameter>) => {
    return Object.entries(parameters).map(([name, param]) => (
      <tr key={name} className="border-t">
        <td className="px-4 py-2">{name}</td>
        <td className="px-4 py-2">{param.type}</td>
        <td className="px-4 py-2">{param.required ? "Yes" : "No"}</td>
        <td className="px-4 py-2">{param.description}</td>
      </tr>
    ));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {endpoints.map((endpoint, index) => (
            <Card
              key={index}
              className={`p-4 cursor-pointer ${
                selectedEndpoint?.service === endpoint.service
                  ? "border-blue-500"
                  : ""
              }`}
              onClick={() => {
                setSelectedEndpoint(endpoint);
                const sampleData = Object.entries(endpoint.parameters).reduce(
                  (acc, [key, param]) => {
                    if (param.value !== undefined) {
                      acc[key] = param.value;
                    } else {
                      switch (param.type.toLowerCase()) {
                        case "string":
                          acc[key] = "";
                          break;
                        case "number":
                          acc[key] = 0;
                          break;
                        case "boolean":
                          acc[key] = false;
                          break;
                        case "array":
                          acc[key] = [];
                          break;
                        case "object":
                          acc[key] = {};
                          break;
                        default:
                          acc[key] = null;
                      }
                    }
                    return acc;
                  },
                  /* eslint-disable  @typescript-eslint/no-explicit-any */
                  {} as Record<string, any>
                );
                setJsonData(JSON.stringify(sampleData, null, 2));
                setResponse("");
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <span
                      className={`px-2 py-1 rounded text-sm ${getMethodColor(
                        endpoint.method
                      )}`}
                    >
                      {endpoint.method}
                    </span>{" "}
                    {endpoint.service}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(endpoint.service);
                    }}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mt-2">
                  {endpoint.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedEndpoint && (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              {selectedEndpoint.method} {selectedEndpoint.service}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {selectedEndpoint.description}
            </p>

            {Object.keys(selectedEndpoint.parameters).length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Parameters</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Required</th>
                        <th className="px-4 py-2 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renderParameters(selectedEndpoint.parameters)}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Request Data (JSON)</Label>
                <Textarea
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  className="font-mono text-sm h-64"
                  placeholder="Enter JSON data"
                />
              </div>

              <Button
                onClick={handleExecute}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Executing..." : "Execute"}
              </Button>

              {response && (
                <div className="space-y-2">
                  <Label>Response</Label>
                  <Textarea
                    value={response}
                    readOnly
                    className="font-mono text-sm h-64"
                  />
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
