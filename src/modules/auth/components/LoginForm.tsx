"use client"

import { Button } from "@/core/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form"
import { Input } from "@/core/components/ui/input"
import { Alert, AlertDescription } from "@/core/components/ui/alert"
import { useMutation } from "@tanstack/react-query"
import { AuthService } from "@/modules/auth/services/auth.service"
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/core/types/api/response.interface"
import { useRouter } from "next/navigation"
import { useFormWithSchema } from "@/core/hooks/useReactHookForm"
import { LoginFormData, loginSchema } from "@/modules/auth/schema/login.schema"
import { ILoginCredentials } from "../types/login.interface"
import Link from "next/link"
import { useTranslations } from "next-intl"

export function LoginForm() {
  const router = useRouter()
  const t = useTranslations("auth.forms")
  const tErrors = useTranslations("auth.errors")
  const tSuccess = useTranslations("auth.success")

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
        message: tSuccess("loginSuccess"),
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
    <div className="fixed inset-0 bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-container relative w-full max-w-[400px] h-full bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-lg">
          <div className="login-box w-full max-w-[300px] mx-auto text-center my-6 md:my-10 px-4">
            <h2 className="text-white text-2xl font-semibold mb-4">
              {t("login")}
            </h2>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm font-medium">
                        {t("username")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="bg-transparent border-white/50 text-white placeholder:text-white/70"
                          placeholder={t("username")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-sm font-medium">
                        {t("password")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="bg-transparent border-white/50 text-white placeholder:text-white/70"
                          placeholder={t("password")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between text-sm text-white/80">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" className="w-4 h-4" />
                    <label htmlFor="remember">{t("rememberMe")}</label>
                  </div>
                  <Link href="#" className="hover:text-white transition-colors">
                    {t("forgotPassword")}
                  </Link>
                </div>

                {loginMutation.error && (
                  <Alert
                    variant="destructive"
                    className="bg-red-500/20 border-red-500/50"
                  >
                    <AlertDescription className="text-red-200">
                      {tErrors("invalidCredentials")}
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? t("loggingIn") : t("login")}
                </Button>

                <p className="text-sm text-white/80">
                  {t("dontHaveAccount")}{" "}
                  <Link
                    href="/register"
                    className="text-white font-semibold hover:underline"
                  >
                    {t("register")}
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
