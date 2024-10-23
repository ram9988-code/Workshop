import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="hover:opacity-75 transition items-center gap-x-2">
        <Image src={"./logo.svg"} alt="Logo" height={30} width={30} />
        <p className="text-lg text-neutral-700 pb-1">Workshop</p>
      </div>
    </Link>
  );
};

export default Logo;
