"use client";

import Image from "next/image";
import { useState } from "react";
import { navLinks } from "@/lib/nav";
import { Icon } from "./Icon";

type HeaderSite = {
  fullName: string;
  address: string;
  phone: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
};

export function Header({ site }: { site: HeaderSite }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
          <a href="#beranda" className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt={`Logo ${site.fullName}`}
              width={64}
              height={65}
              className="size-14 shrink-0 object-contain sm:size-16"
            />
            <span>
              <span className="block text-base font-bold uppercase leading-tight text-gold-dark sm:text-lg">
                {site.fullName}
              </span>
              <span className="mt-0.5 hidden text-sm text-slate-500 sm:block">
                {site.address}
              </span>
              <span className="block text-sm text-slate-500">
                Telp. {site.phone}
              </span>
            </span>
          </a>
          <div className="hidden items-center gap-2 text-slate-400 md:flex">
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-full p-2 transition-colors hover:bg-slate-100 hover:text-navy"
            >
              <Icon name="facebook" />
            </a>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full p-2 transition-colors hover:bg-slate-100 hover:text-navy"
            >
              <Icon name="instagram" />
            </a>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="rounded-full p-2 transition-colors hover:bg-slate-100 hover:text-navy"
            >
              <Icon name="whatsapp" />
            </a>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-40 bg-navy text-white shadow-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
          <ul className="hidden lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block px-3.5 py-4 text-sm font-medium text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="-ml-2 p-3 lg:hidden"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} className="size-6" />
          </button>
          <a
            href="#donasi"
            className="my-2 inline-flex items-center gap-2 bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-widest text-navy transition-colors hover:bg-gold"
          >
            <Icon name="heart" className="size-4" />
            Donasi
          </a>
        </div>
        {open && (
          <ul className="border-t border-white/10 px-4 pb-3 lg:hidden">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-sm font-medium text-white/85"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </>
  );
}
