import { MenuIcon } from "../icons/MenuIcon";
import { ProfileIconFromWhatsApp } from "../icons/ProfileIcon";
import { SearchIcon } from "../icons/SearchIcon";

export const MessageWindowHeader = ({ roomId }: { roomId: string }) => {
  return (
    <div className="flex h-16 justify-between bg-[#161717] bg-fixed px-4 py-3 text-white">
      <div className="flex items-center gap-4">
        <ProfileIconFromWhatsApp />
        <div className="">
          <h1 className="font-bold text-white">{roomId}</h1>
          <p className="text-xs text-gray-300">
            Last seen yesterday at 5:34 pm
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <SearchIcon />
        </div>
        <div>
          <MenuIcon />
        </div>
      </div>
    </div>
  );
};
