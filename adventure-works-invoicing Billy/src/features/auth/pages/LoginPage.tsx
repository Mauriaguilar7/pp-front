"use client"

import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslation } from "react-i18next"
import { LoginSchema, type LoginData } from "@/lib/validations"
import { useAuth } from "../hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Loader2 } from "lucide-react"

export function LoginPage() {
  const { t } = useTranslation()
  const { isAuthenticated, login, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const rememberMe = watch("rememberMe")

  useEffect(() => {
    // Load remembered email if exists
    const rememberedEmail = localStorage.getItem("remembered_email")
    if (rememberedEmail) {
      setValue("email", rememberedEmail)
      setValue("rememberMe", true)
    }
  }, [setValue])

  const onSubmit = (data: LoginData) => {
    // Handle remember me
    if (data.rememberMe) {
      localStorage.setItem("remembered_email", data.email)
    } else {
      localStorage.removeItem("remembered_email")
    }

    login(data)
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-full">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Adventure Works</CardTitle>
          <CardDescription>Sistema de Facturación Electrónica</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@adventureworks.com"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
              />
              <Label htmlFor="rememberMe" className="text-sm">
                {t("recordarme")}
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("iniciarSesion")}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">Usuarios de prueba:</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>
                <strong>Admin:</strong> admin@adventureworks.com
              </p>
              <p>
                <strong>Cajero:</strong> cajero@adventureworks.com
              </p>
              <p>
                <strong>Supervisor:</strong> supervisor@adventureworks.com
              </p>
              <p>
                <strong>Contraseña:</strong> password123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
