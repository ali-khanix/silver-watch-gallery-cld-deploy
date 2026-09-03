"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { CATEGORY_GROUPS } from "@/lib/category-groups";

type Category = {
  id: string;
  name: string;
  slug: string;
  group: string | null;
};

const VISIBLE_COUNT = 5;

const groupLabel = (value: string | null) =>
  CATEGORY_GROUPS.find((g) => g.value === value)?.label ?? "بدون گروه";

const AdminCategoriesList = ({ categories }: { categories: Category[] }) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [group, setGroup] = useState("");
  const [saving, setSaving] = useState(false);

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setGroup(category.group ?? "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setGroup("");
  };

  const handleSave = async (id: string) => {
    if (!name.trim() || !slug.trim()) {
      toast.error("نام و اسلاگ الزامی است");
      return;
    }
    setSaving(true);
    const res = await fetch(`/api/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, group: group || null }),
    });
    setSaving(false);

    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error || "خطا در ویرایش دسته بندی");
      return;
    }
    toast.success("دسته بندی ویرایش شد");
    cancelEditing();
    router.refresh();
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(`حذف دسته بندی "${name}"؟`);
    if (!confirmed) return;

    setDeletingId(id);
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (!res.ok) {
      const { error } = await res.json();
      toast.error(error || "خطا در حذف دسته بندی");
      return;
    }

    toast.success("دسته بندی حذف شد");
    router.refresh();
  };

  const visibleCategories = expanded
    ? categories
    : categories.slice(0, VISIBLE_COUNT);
  const hiddenCount = categories.length - VISIBLE_COUNT;

  return (
    <>
      <ul className="mt-4 flex flex-col gap-2">
        {visibleCategories.map((c) => {
          const isEditing = editingId === c.id;

          if (isEditing) {
            return (
              <li
                key={c.id}
                className="flex flex-col gap-2 text-sm border rounded-md p-3 bg-zinc-50"
              >
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام دسته بندی"
                  className="border rounded-md p-2 w-full"
                />
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="اسلاگ"
                  className="border rounded-md p-2 w-full"
                />
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="border rounded-md p-2 w-full"
                >
                  <option value="">بدون گروه</option>
                  {CATEGORY_GROUPS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={cancelEditing}
                    disabled={saving}
                    className="px-3 py-1.5 rounded-md border disabled:opacity-50"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={() => handleSave(c.id)}
                    disabled={saving}
                    className="px-3 py-1.5 rounded-md bg-zinc-950 text-white disabled:opacity-50"
                  >
                    {saving ? "در حال ذخیره..." : "ذخیره"}
                  </button>
                </div>
              </li>
            );
          }

          return (
            <li
              key={c.id}
              className="flex items-center justify-between text-sm"
            >
              <span>
                {c.name} ({c.slug})
                <span className="text-zinc-400"> — {groupLabel(c.group)}</span>
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => startEditing(c)}
                  className="text-zinc-600 hover:text-zinc-900 flex items-center gap-1"
                >
                  <Pencil size={14} /> ویرایش
                </button>
                <button
                  onClick={() => handleDelete(c.id, c.name)}
                  disabled={deletingId === c.id}
                  className="text-red-500 underline disabled:opacity-50"
                >
                  حذف
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {categories.length > VISIBLE_COUNT && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 flex items-center gap-1 text-sm text-zinc-600 hover:text-zinc-900"
        >
          {expanded ? (
            <>
              <ChevronUp size={16} /> نمایش کمتر
            </>
          ) : (
            <>
              <ChevronDown size={16} /> نمایش {hiddenCount} دسته بندی دیگر
            </>
          )}
        </button>
      )}
    </>
  );
};

export default AdminCategoriesList;
