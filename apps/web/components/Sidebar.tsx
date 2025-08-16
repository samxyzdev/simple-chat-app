"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { MessageIcon } from "../icons/MessageIcon";
import { ProfileIcon } from "../icons/ProfileIcon";
import { SettingIcon } from "../icons/SettingIcon";
import { IconWrapper } from "./IconWrapeer";
import { ProfileBox } from "./ProfileBox";

export default function Sidebar() {
  const [showProfileBox, setShowProfileBox] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    const logout = await axios.post(
      `${BACKEND_URL}/auth/signout`,
      {},
      { withCredentials: true },
    );
    if (logout.status === 204) {
      router.push("/");
    }
  };

  return (
    <section className="relative w-16 border-r border-gray-700 bg-[#1D1F1F]">
      <div className="flex min-h-screen flex-col justify-between p-3">
        <div className="space-y-2 rounded-xl text-gray-200">
          <IconWrapper>
            <MessageIcon />
          </IconWrapper>
          {/* <IconWrapper>
            <StatusIcon />
          </IconWrapper> */}
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
        {showProfileBox ? (
          <div className="absolute bottom-3 left-12 z-50">
            <ProfileBox
              onClick={handleLogout}
              onMouseLeave={() => setShowProfileBox(false)}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </section>
  );
}
