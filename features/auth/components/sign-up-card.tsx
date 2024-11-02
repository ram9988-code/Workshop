"use client";

import { z } from "zod";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import DotteSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SignUpSchema } from "../schema";
import { useRegister } from "../api/use-register";
import { Loader } from "lucide-react";

const SignUpCard = () => {
  const { mutate, isPending } = useRegister();
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SignUpSchema>) => {
    mutate({ json: values });
  };
  return (
    <Card className="w-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-3xl">Sign Up</CardTitle>
        <CardDescription>
          By sign up, your agree to our{" "}
          <Link href={"/privacy"}>
            <span className="text-blue-700">Privacy Policy</span>
          </Link>{" "}
          and{" "}
          <Link href={"/terms"}>
            <span className="text-blue-700">Terms of Service</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="txt"
                      placeholder="Enter Your name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter email adress"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} size={"lg"} className="w-full">
              {isPending ? (
                <Loader className="size-4 animate-spin text-muted-foreground" />
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DotteSeparator />
      </div>
      <CardContent className="space-y-2">
        <Button
          disabled={isPending}
          className="w-full mt-4"
          variant={"secondary"}
          size={"lg"}
        >
          <FcGoogle className="size-5" />
          Login with Google
        </Button>
        <Button
          disabled={isPending}
          className="w-full mt-4"
          variant={"secondary"}
          size={"lg"}
        >
          <FaGithub className="size-5" />
          Login with Github
        </Button>
      </CardContent>
      <div className="px-7">
        <DotteSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          Already have an account?{" "}
          <Link href={"/sign-in"}>
            <span className="text-blue-700">Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
