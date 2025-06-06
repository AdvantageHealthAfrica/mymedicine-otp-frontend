import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center sticky top-5">
      <Image
        src={
          "https://res.cloudinary.com/ddynvenje/image/upload/v1749205137/AHA/AHA-logo_vfsmvr.png"
        }
        alt="Logo"
        width={200}
        height={100}
        className="w-60 h-26"
      />
    </Link>
  );
};

export default Logo;
