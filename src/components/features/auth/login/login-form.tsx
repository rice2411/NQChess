"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation } from "@tanstack/react-query";
import { AuthService, LoginCredentials } from "@/services/auth/auth.service";
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/types/api/response.interface";
import { useRouter } from "next/navigation";

import { useFormWithSchema } from "@/hooks/use-form";
import {
  LoginFormData,
  loginSchema,
} from "@/components/features/auth/login/auth.schema";

export function LoginForm() {
  const router = useRouter();
  const form = useFormWithSchema({
    schema: loginSchema,
  });

  const loginMutation = useMutation<
    ISuccessResponse<any> | IErrorResponse,
    Error,
    LoginCredentials
  >({
    mutationFn: async (credentials) => {
      const response = await AuthService.login(credentials);
      return {
        success: true,
        message: "Đăng nhập thành công",
        data: response,
      };
    },
    onSuccess: () => {
      router.push("/");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

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
  );
}
