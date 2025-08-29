"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod/mini";

import { LOGIN_URL } from "@/config";
import { FormButton } from "@/components/form/form-button";
import { FormError } from "@/components/form/form-error";
import { FormInput } from "@/components/form/form-input";
import { FormPasswordCustom } from "@/components/form/form-password-custom";
import { Form } from "@/components/ui/form";
import { RegisterSchema, RegisterType } from "@/app/(auth)/register/type";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<RegisterType>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setLoading(true);
    console.log(values);
    const isSuccess = Math.random() > 0.5;
    const isError = !isSuccess;
    if (!isError) {
      toast.success(
        "Registration successful! Check your email to verify your account."
      );
    } else {
      setError("Registration Failed");
    }

    setLoading(false);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h1 className="text-center text-3xl font-bold">Register</h1>
        {error && <FormError error={{ message: error }} />}
        <FormInput<RegisterType>
          title="Name"
          schema="name"
          placeholder="John Doe"
        />
        <FormInput<RegisterType>
          title="Email"
          schema="email"
          placeholder="example@email.com"
        />
        <FormPasswordCustom<RegisterType> title="Password" schema="password" />
        <FormButton className="w-full" isLoading={loading}>
          Register
        </FormButton>
        <div className="flex justify-center">
          <Link
            href={LOGIN_URL}
            className="text-sm underline-offset-4 hover:underline"
          >
            Already have an account?
          </Link>
        </div>
      </form>
    </Form>
  );
}
