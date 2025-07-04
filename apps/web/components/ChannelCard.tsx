import { ProfileIconFromWhatsApp } from "../icons/ProfileIcon";

export const ChannelCard = ({
  name,
  lastMessage,
  time,
  onClick,
}: {
  name: string;
  lastMessage: string;
  time: string;
  onClick: () => any;
}) => {
  return (
    <section className="flex h-[70px] cursor-pointer items-center gap-3 rounded-md px-3 text-white hover:bg-[#2E2F2F]">
      <div>
        <ProfileIconFromWhatsApp />
      </div>
      <button onClick={onClick} className="flex-1">
        <div className="flex justify-between">
          <h1 className="">{name}</h1>
          <p className="text-xs">{time}</p>
        </div>
        <p className="flex items-start pt-2 text-xs text-gray-400">
          {lastMessage}
        </p>
      </button>
    </section>
  );
};
