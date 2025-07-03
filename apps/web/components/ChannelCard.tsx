import { ProfileIconFromWhatsApp } from "../icons/ProfileIcon";

export const ChannelCard = ({
  name,
  lastMessage,
  time,
}: {
  name: string;
  lastMessage: string;
  time: string;
}) => {
  return (
    <section className="flex h-[70px] items-center gap-3 rounded-md px-3 text-white hover:bg-[#2E2F2F]">
      <div>
        <ProfileIconFromWhatsApp />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h1 className="">{name}</h1>
          <p className="text-xs">{time}</p>
        </div>
        <p className="text-xs text-gray-400">{lastMessage}</p>
      </div>
    </section>
  );
};
