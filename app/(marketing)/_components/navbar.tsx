import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import UserButton from "@/features/auth/components/user-button";
import Link from "next/link";
import { Models } from "node-appwrite";
import React from "react";

interface NavbarProps {
  user: Models.User<Models.Preferences>;
}

export const Navbar = ({ user }: NavbarProps) => {
  return (
    <div className="fixed top-0 w-full h-14 px-20 border-b shadow-sm bg-white flex items-center">
      <div className="md:max-w-screen-2xl mx-auto flex justify-between w-full items-center">
        <Logo />
        <div className="space-x-4 md:block md:w-auto flex items-center justify-between w-full">
          <Button size={"sm"} variant={"outline"} asChild>
            <Link href={"/sign-in"}>Login</Link>
          </Button>
          <Button>
            <Link href={"/sign-up"}>Create Account</Link>
          </Button>
        </div>
        <UserButton />
      </div>
    </div>
  );
};
