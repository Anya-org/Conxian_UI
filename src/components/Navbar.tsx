import Link from "next/link";

export default function Navbar() {
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
    <nav className="w-full border-b border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-10 h-14 flex items-center gap-6">
        <div className="font-bold text-lg">Conxian</div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
