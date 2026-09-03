"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "./ui/button";
import ProfileButton from "./ProfileButton";
import { useAuth } from "@/lib/AuthContext";

const AuthButtons = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return user ? (
    <ProfileButton user={user} />
  ) : (
    <Link href="/login">
      <Button className="bg-transparent text-[12px]">
        <User size={64} />
        ورود یا ثبت نام
      </Button>
    </Link>
  );
};

export default AuthButtons;
