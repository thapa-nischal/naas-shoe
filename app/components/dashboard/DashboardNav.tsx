"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Orders", href: "/dashboard/orders" },
  { name: "Products", href: "/dashboard/products" },
  { name: "Banner", href: "/dashboard/banner" },
];

export function DashboardNav() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            link.href === pathname
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }
        >
          {link.name}
        </Link>
      ))}
    </>
  );
}
