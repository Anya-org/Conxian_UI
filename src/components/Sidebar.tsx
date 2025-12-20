
"use client";
import {
  CreditCardIcon,
  HomeIcon,
  ShieldCheckIcon,
  PlusCircleIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Invest", href: "/invest", icon: CurrencyDollarIcon },
  { name: "Add Liquidity", href: "/add-liquidity", icon: PlusCircleIcon },
  { name: "My Positions", href: "/positions", icon: CreditCardIcon },
  { name: "Shielded Wallets", href: "/shielded", icon: ShieldCheckIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50 bg-primary border-r border-accent/20">
      <div className="flex items-center h-16 px-6 bg-primary border-b border-accent/20">
        <h1 className="text-2xl font-bold text-light">Conxian</h1>
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md",
                pathname === item.href
                  ? "bg-accent/20 text-light"
                  : "text-light/70 hover:text-light hover:bg-accent/20"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 flex-shrink-0 h-6 w-6",
                  pathname === item.href
                    ? "text-light"
                    : "text-light/50 group-hover:text-light"
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
