"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  userName?: string | null;
  userImage?: string | null;
}

export default function Header({ userName, userImage }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: "/dashboard", label: "Inicio" },
    { href: "/rutinas", label: "Rutinas" },
    { href: "/historial", label: "Historial" },
    { href: "/estadisticas", label: "Estadísticas" },
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const initials = userName
    ? userName.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : "?";

  return (
    <header style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
      <div className="mx-auto max-w-2xl lg:max-w-5xl px-4">
        {/* Top bar */}
        <div className="flex h-14 items-center justify-between">
          <Link href="/dashboard">
            <span
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "1.5rem",
                letterSpacing: "0.05em",
                color: "var(--push)",
              }}
            >
              GYMTRACK
            </span>
          </Link>

          {/* Avatar + dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 cursor-pointer p-1"
              style={{ background: "none", border: "none", borderRadius: "var(--radius-md)" }}
            >
              {/* Nombre */}
              {userName && (
                <span
                  className="text-[0.82rem] font-medium max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ color: "var(--text-muted)" }}
                >
                  {userName.split(" ")[0]}
                </span>
              )}
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                style={{
                  background: "var(--border)",
                  border: menuOpen ? "2px solid var(--push)" : "2px solid transparent",
                  transition: "border-color 0.15s",
                }}
              >
                {userImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userImage}
                    alt={userName ?? "Avatar"}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-[0.7rem] font-bold" style={{ color: "var(--text-muted)" }}>
                    {initials}
                  </span>
                )}
              </div>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div
                className="absolute top-[calc(100%+8px)] right-0 p-2 z-50"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  minWidth: "180px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
              >
                {/* Info del usuario */}
                <div
                  className="px-2.5 pb-2.5 pt-2 mb-1.5"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <p className="text-[0.85rem] font-semibold m-0" style={{ color: "var(--text)" }}>
                    {userName ?? "Usuario"}
                  </p>
                </div>

                {/* Opciones */}
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="block w-full text-left px-2.5 py-2 text-[0.85rem] font-medium cursor-pointer"
                  style={{
                    background: "none",
                    border: "none",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--danger)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "var(--danger-bg)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "none";
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex gap-1 pb-2">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1 text-[0.85rem] no-underline transition-all duration-150"
                style={{
                  borderRadius: "var(--radius-sm)",
                  fontWeight: active ? "600" : "400",
                  color: active ? "var(--push)" : "var(--text-muted)",
                  background: active ? "var(--push-bg)" : "transparent",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
