import { MenuIcon } from "../icons/MenuIcon";
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
    <section className="flex h-[70px] items-center gap-3 rounded-md px-3 text-white hover:bg-[#2E2F2F]">
      <div>
        <ProfileIconFromWhatsApp />
      </div>
      <div className="flex w-full items-center justify-between">
        <button onClick={onClick} className="">
          <h1 className="cursor-pointer">{name}</h1>
        </button>
        <p className="text-[12px] text-gray-50">{time}</p>
        <button onClick={copyToClipboard} className="cursor-pointer">
          <CopyIcon />
        </button>
      </div>
    </section>
  );
};

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
      />
    </svg>
  );
}
