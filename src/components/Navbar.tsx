"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const proPages = ["/network", "/pools", "/contracts", "/router", "/tx"];
  const isPro = proPages.some((p) => pathname.startsWith(p));

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/swap", label: "Swap" },
    { href: "/network", label: "Network" },
    { href: "/tokens", label: "Tokens" },
    { href: "/pools", label: "Pools" },
    { href: "/contracts", label: "Contracts" },
    { href: "/router", label: "Router" },
    { href: "/tx", label: "Transactions" },
  ];
  return (
    <nav
      className={`w-full border-b border-neutral-medium transition-colors ${
        isPro ? "bg-primary-dark" : "bg-primary"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-10 h-14 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Conxian Logo"
            width={120}
            height={30}
          />
          {isPro && (
            <span className="text-accent font-bold text-sm bg-neutral-dark/50 rounded-md px-2 py-0.5">
              PRO
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-neutral-light">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-accent transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
