
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
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50 lg:bg-gray-900 lg:border-r lg:border-gray-800">
      <div className="flex items-center h-16 px-6 bg-gray-900 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">Conxian</h1>
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
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 flex-shrink-0 h-6 w-6",
                  pathname === item.href
                    ? "text-gray-300"
                    : "text-gray-500 group-hover:text-gray-300"
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
