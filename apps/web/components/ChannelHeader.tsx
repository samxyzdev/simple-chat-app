import { MenuIcon } from "../icons/MenuIcon";
import { NewchatIcon } from "../icons/NewchatIcon";
import { IconWrapper } from "./IconWrapeer";

export const ChannelHeader = () => {
  return (
    <div className="flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold text-white">WhatsApp</h1>
      <div className="flex gap-4">
        <IconWrapper>
          <NewchatIcon />
        </IconWrapper>
        <IconWrapper>
          <MenuIcon />
        </IconWrapper>
      </div>
    </div>
  );
};
