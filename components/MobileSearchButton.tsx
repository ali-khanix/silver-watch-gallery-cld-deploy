"use client";

import { useState } from "react";
import { SearchIcon, X } from "lucide-react";
import SearchBar from "./SearchBar";

const MobileSearchButton = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "بستن جستجو" : "جستجو"}
        className="text-gray-300"
      >
        {open ? <X size={32} /> : <SearchIcon size={32} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-zinc-950 px-4 pb-4 z-40">
          <SearchBar display="flex" isAdmin={isAdmin} autoFocus />
        </div>
      )}
    </>
  );
};

export default MobileSearchButton;
