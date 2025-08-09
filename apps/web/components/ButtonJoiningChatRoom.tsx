import { NewchatIcon } from "../icons/NewchatIcon";

export const ButtonJoiningChatRoom = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="mt-4 text-white">
      <button
        onClick={onClick}
        className="min-w-40 rounded-4xl border border-gray-700 p-4 hover:bg-[#292A2A]"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm">Join a Room</span>
          <NewchatIcon />
        </div>
      </button>
    </div>
  );
};
