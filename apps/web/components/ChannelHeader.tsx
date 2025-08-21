"use client";
import { useState } from "react";
import { ProfileBox } from "./ProfileBox";

export const ChannelHeader = () => {
  const [showProfileBox, setShowProfileBox] = useState(false);
  return (
    <div className="relative flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold text-white">WhatsApp</h1>
      <div className="flex gap-4">
        {/* <IconWrapper>
          <NewchatIcon />
        </IconWrapper> */}
        <div onClick={() => setShowProfileBox((prev) => !prev)}>
          {/* <IconWrapper>
            <MenuIcon />
          </IconWrapper> */}
        </div>
        {showProfileBox ? (
          <div className="absolute top-12 right-6 z-50">
            <ProfileBox onMouseLeave={() => setShowProfileBox(false)} />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
