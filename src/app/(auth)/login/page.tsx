"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod/mini";

import { FormButton } from "@/components/form/form-button";
import { FormError } from "@/components/form/form-error";
import { FormInput } from "@/components/form/form-input";
import { FormPassword } from "@/components/form/form-password";
import { Form } from "@/components/ui/form";
import { LoginSchema, LoginType } from "@/app/(auth)/login/type";
import { toast } from "sonner";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    console.log(values);
    const isSuccess = Math.random() > 0.5;
    const isError = !isSuccess;
    if (!isError) {
      toast.success("Login successful! Redirecting to your dashboard.");
    } else {
      setError("Login Failed");
    }
    setLoading(false);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h1 className="text-center text-3xl font-bold">Login</h1>
        {error && <FormError error={{ message: error }} />}
        <FormInput<LoginType>
          title="Email"
          schema="email"
          placeholder="example@email.com"
        />
        <FormPassword<LoginType> title="Password" schema="password" />
        <Link
          href="/forgot-password"
          className="text-sm underline-offset-4 hover:underline -mt-4 flex"
        >
          Forgot your password?
        </Link>
        <FormButton className="w-full" isLoading={loading}>
          Login
        </FormButton>
        <div className="flex justify-center">
          <Link
            href="/register"
            className="text-sm underline-offset-4 hover:underline"
          >
            Do not have an account?
          </Link>
        </div>
      </form>
    </Form>
  );
}
