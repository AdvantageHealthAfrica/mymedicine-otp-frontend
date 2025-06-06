import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center justify-center mb-20 sticky top-5"
    >
      <Image
        src={
          "https://res.cloudinary.com/ddynvenje/image/upload/v1749205137/AHA/AHA-logo_vfsmvr.png"
        }
        alt="Logo"
        width={200}
        height={200}
        className="w-32 h-32"
      />
    </Link>
  );
};

export default Logo;
