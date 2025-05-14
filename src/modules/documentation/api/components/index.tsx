"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card"
import { Button } from "@/core/components/ui/button"
import { Label } from "@/core/components/ui/label"
import { Textarea } from "@/core/components/ui/textarea"
import { CopyIcon } from "lucide-react"
import {
  IApiDocumentationProps,
  IEndpoint,
  IParameter,
} from "@/modules/documentation/api/interface/apiEndpoint.interface"
import { useQueryClient } from "@tanstack/react-query"

const getMethodColor = (method: string) => {
  switch (method) {
    case "GET":
      return "bg-green-100 text-green-800"
    case "POST":
      return "bg-blue-100 text-blue-800"
    case "PUT":
      return "bg-yellow-100 text-yellow-800"
    case "DELETE":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ApiDocumentation({
  title,
  endpoints,
  onExecute,
}: IApiDocumentationProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<IEndpoint | null>(
    null
  )
  const [jsonData, setJsonData] = useState<string>("")
  const [response, setResponse] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const handleExecute = async () => {
    if (!selectedEndpoint) return
    setIsLoading(true)
    try {
      const params = jsonData ? JSON.parse(jsonData) : {}
      const result = await onExecute(selectedEndpoint, params)
      setResponse(JSON.stringify(result, null, 2))
      queryClient.invalidateQueries({ queryKey: [selectedEndpoint.service] })
    } catch (error) {
      setResponse(
        JSON.stringify(
          {
            success: false,
            errorCode: "API_ERROR",
            message:
              error instanceof Error ? error.message : "Unknown error occurred",
          },
          null,
          2
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const renderParameters = (parameters: Record<string, IParameter>) => {
    return Object.entries(parameters).map(([name, param]) => (
      <div key={name} className="mb-2">
        <Label className="font-medium text-white">
          {name} {param.required && <span className="text-red-500">*</span>}
        </Label>
        <p className="text-sm text-white/80">{param.description}</p>
        <p className="text-sm text-white/80">Type: {param.type}</p>
      </div>
    ))
  }

  return (
    <div className="min-h-screen bg-black/30 backdrop-blur-md">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 lg:mb-4">
            {title}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white/90">
            Explore and test our API endpoints
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {/* Endpoints List */}
          <div className="md:col-span-2 lg:col-span-1">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 h-full">
              <CardHeader>
                <CardTitle className="text-white text-lg md:text-xl">
                  Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 md:space-y-4 max-h-[600px] overflow-y-auto">
                  {endpoints.map((endpoint) => (
                    <div
                      key={endpoint.service}
                      className={`p-3 md:p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedEndpoint?.service === endpoint.service
                          ? "bg-white/20"
                          : "hover:bg-white/10"
                      }`}
                      onClick={() => {
                        setSelectedEndpoint(endpoint)
                        const sampleData = Object.entries(
                          endpoint.parameters
                        ).reduce((acc, [key, param]) => {
                          if (param.value !== undefined) {
                            acc[key] = param.value
                          } else {
                            switch (param.type.toLowerCase()) {
                              case "string":
                                acc[key] = ""
                                break
                              case "number":
                                acc[key] = 0
                                break
                              case "boolean":
                                acc[key] = false
                                break
                              case "array":
                                acc[key] = []
                                break
                              case "object":
                                acc[key] = {}
                                break
                              default:
                                acc[key] = null
                            }
                          }
                          return acc
                        }, {} as Record<string, any>)
                        setJsonData(JSON.stringify(sampleData, null, 2))
                        setResponse("")
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs md:text-sm font-medium ${getMethodColor(
                            endpoint.method
                          )}`}
                        >
                          {endpoint.method}
                        </span>
                        <span className="text-white text-sm md:text-base break-all">
                          {endpoint.service}
                        </span>
                      </div>
                      <p className="text-white/80 text-xs md:text-sm mt-1 line-clamp-2">
                        {endpoint.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Endpoint Details and Testing */}
          <div className="md:col-span-2 lg:col-span-3">
            {selectedEndpoint ? (
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {/* Parameters Documentation */}
                <div className="col-span-1">
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg md:text-xl">
                        Parameters
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedEndpoint.parameters && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {renderParameters(selectedEndpoint.parameters)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Request and Response */}
                <div className="col-span-1 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white text-lg md:text-xl">
                        Test Endpoint
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 md:space-y-4">
                        <div>
                          <Label className="text-white text-sm md:text-base">
                            Request Body
                          </Label>
                          <Textarea
                            value={jsonData}
                            onChange={(e) => setJsonData(e.target.value)}
                            placeholder="Enter JSON data"
                            className="mt-2 bg-white/5 border-white/10 text-white test-xs md:text-base min-h-[150px]"
                            rows={10}
                          />
                        </div>
                        <Button
                          onClick={handleExecute}
                          disabled={isLoading}
                          className="w-full bg-white/20 hover:bg-white/30 text-white text-sm md:text-base"
                        >
                          {isLoading ? "Executing..." : "Execute"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-white text-lg md:text-xl">
                          Response
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(response)}
                          className="text-white hover:text-white text-sm md:text-base"
                        >
                          <CopyIcon className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-black/20 rounded-lg p-4">
                        <pre className="text-white text-sm md:text-base overflow-x-auto">
                          {response || "No response yet"}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/80 text-lg">
                  Select an endpoint to test
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
