"use client";
import React from "react";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SignInLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: SignInLayoutProps) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/sign-in";
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="fixed top-0 w-full h-14 px-10 md:px-20 border-b shadow-sm bg-white flex items-center">
        <div className="md:max-w-screen-2xl mx-auto flex justify-between w-full items-center">
          <Logo />
          <div className="space-x-4 md:block md:w-auto flex items-center justify-between">
            <Button asChild size={"sm"} variant={"outline"}>
              <Link href={isLoginPage ? "/sign-up" : "/sign-in"}>
                {isLoginPage ? "Create Account" : "Login"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center pt-10 md:pt-20">
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
