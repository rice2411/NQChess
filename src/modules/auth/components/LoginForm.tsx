"use client"

import { Button } from "@/shared/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { Alert, AlertDescription } from "@/shared/components/ui/alert"
import { useMutation } from "@tanstack/react-query"
import { AuthService } from "@/modules/auth/services/auth.service"
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/core/types/api/response.interface"
import { useRouter } from "next/navigation"

import { useFormWithSchema } from "@/shared/hooks/useReactHookForm"
import { LoginFormData, loginSchema } from "@/modules/auth/schema/login.schema"
import { ILoginCredentials } from "../types/login.interface"

export function LoginForm() {
  const router = useRouter()
  const form = useFormWithSchema({
    schema: loginSchema,
  })

  const loginMutation = useMutation<
    ISuccessResponse<any> | IErrorResponse,
    Error,
    ILoginCredentials
  >({
    mutationFn: async (credentials) => {
      const response = await AuthService.login(credentials)
      return {
        success: true,
        message: "Đăng nhập thành công",
        data: response,
      }
    },
    onSuccess: () => {
      router.push("/")
    },
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên đăng nhập</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên đăng nhập" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Nhập mật khẩu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {loginMutation.error && (
          <Alert variant="destructive">
            <AlertDescription>{loginMutation.error.message}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>
    </Form>
  )
}
