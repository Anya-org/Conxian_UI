import Link from "next/link";

export default function Navbar() {
  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/network", label: "Network" },
    { href: "/tokens", label: "Tokens" },
    { href: "/pools", label: "Pools" },
    { href: "/contracts", label: "Contracts" },
    { href: "/router", label: "Router" },
    { href: "/tx", label: "Transactions" },
  ];
  return (
    <nav className="w-full border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-6xl px-4 h-12 flex items-center gap-4">
        <div className="font-semibold">Conxian</div>
        <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="hover:underline">{l.label}</Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
