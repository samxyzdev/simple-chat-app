import { ProfileIconFromWhatsApp } from "../icons/ProfileIcon";

export const ChannelCard = ({
  name,
  lastMessage,
  time,
  onClick,
  chatRoomName,
}: {
  name: string;
  chatRoomName: string;
  lastMessage: string;
  time: string;
  onClick: () => any;
}) => {
  function copyToClipboard() {
    navigator.clipboard.writeText(chatRoomName);
  }
  return (
    <section className="flex items-center gap-4 rounded-xl p-3 text-white hover:bg-[#2E2F2F]">
      <div>
        <ProfileIconFromWhatsApp />
      </div>
      <div className="flex w-full items-start justify-between">
        <div>
          <button onClick={onClick}>
            <h1 className="cursor-pointer">{name}</h1>
          </button>
          <p className="text-sm">{lastMessage}</p>
        </div>
        <p className="text-[12px] text-gray-50">{time}</p>
        {/* <button onClick={copyToClipboard} className="cursor-pointer">
          <CopyIcon />
        </button> */}
      </div>
    </section>
  );
};
