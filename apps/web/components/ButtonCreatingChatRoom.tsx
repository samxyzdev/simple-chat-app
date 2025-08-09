import { LandingSpinner } from "../icons/CopyIcon";
import { NewchatIcon } from "../icons/NewchatIcon";

export const ButtonCreatingChatRoom = ({
  onClick,
  laoding,
}: {
  onClick: () => void;
  laoding: boolean;
}) => {
  return (
    <div className="mt-4 text-white">
      <button
        onClick={onClick}
        className="min-w-40 rounded-4xl border border-gray-700 p-4 hover:bg-[#292A2A]"
      >
        {laoding ? (
          <LandingSpinner spinnerColor="fill-gray-500" h="h-6" w="w-6" />
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm">Create a room</span>
            <NewchatIcon />
          </div>
        )}
      </button>
    </div>
  );
};
