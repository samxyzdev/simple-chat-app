import { MessageIcon } from "../icons/MessageIcon";
import { ProfileIcon } from "../icons/ProfileIcon";
import { SettingIcon } from "../icons/SettingIcon";
import { StatusIcon } from "../icons/StatusIcon";
import { IconWrapper } from "./IconWrapeer";

export default function Sidebar() {
  return (
    <section className="flex w-16 items-center justify-center border-r border-gray-700 bg-[#1D1F1F]">
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
          <IconWrapper>
            <SettingIcon />
          </IconWrapper>
          <IconWrapper>
            <ProfileIcon />
          </IconWrapper>
        </div>
      </div>
    </section>
  );
}
