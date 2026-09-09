"use client";

import { useState } from "react";
import { SearchIcon, X } from "lucide-react";
import SearchBar from "./SearchBar";

const MobileSearchButton = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="جستجو"
        className="sm:hidden"
      >
        <SearchIcon size={28} className="text-gray-300" />
      </button>

      {open && (
        <div dir="rtl" className="fixed inset-0 z-60 bg-zinc-950 sm:hidden">
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="flex-1">
              <SearchBar display="flex" isAdmin={isAdmin} autoFocus />
            </div>
            <button onClick={() => setOpen(false)} aria-label="بستن جستجو">
              <X size={28} className="text-gray-300" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileSearchButton;
