"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { MessageIcon } from "../icons/MessageIcon";
import { ProfileIcon } from "../icons/ProfileIcon";
import { SettingIcon } from "../icons/SettingIcon";
import { StatusIcon } from "../icons/StatusIcon";
import { IconWrapper } from "./IconWrapeer";

export default function Sidebar() {
  const [showProfileBox, setShowProfileBox] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    const logout = await axios.post(`${BACKEND_URL}/user/signout`);

    if (logout.status === 204) {
      router.push("/");
    }
  };

  return (
    <section className="relative w-16 border-r border-gray-700 bg-[#1D1F1F]">
      <div className="flex min-h-screen flex-col justify-between p-3">
        <div className="space-y-2 text-gray-200">
          <IconWrapper>
            <MessageIcon />
          </IconWrapper>
          <IconWrapper>
            <StatusIcon />
          </IconWrapper>
        </div>
        <div className="space-y-2 text-gray-200">
          <button
            onClick={() => {
              setShowProfileBox((prev) => !prev);
            }}
          >
            <IconWrapper>
              <SettingIcon />
            </IconWrapper>
          </button>
          <IconWrapper>
            <ProfileIcon />
          </IconWrapper>
        </div>
        {showProfileBox ? <ProfileBox onClick={handleLogout} /> : ""}
      </div>
    </section>
  );
}

export const ProfileBox = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="absolute bottom-3 left-12 flex h-36 flex-col justify-between rounded-2xl border border-gray-700 bg-[#1D1F1F] p-4 text-gray-200">
      <div>
        <p className="text-md">Sameer Ahmed</p>
        <p className="text-sm text-gray-400">smaeer@gamil.com</p>
      </div>
      <button
        onClick={onClick}
        className="cursor-pointer rounded-xl bg-red-500 px-10 py-2 hover:bg-red-600 active:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};
