"use client"; 

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "../../../public/handcrafted-haven-logo.png"; 

export default function Header() {
  const pathname = usePathname();

  return (
    <header>
      <div className="upper-line">
        <Link href="/">
          <Image className="logo" src={logo} alt="Handcrafted Haven Logo" />
        </Link>
        
        {pathname !== "/login" && (
          <Link href="/login" className="login-button">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}