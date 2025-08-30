import { forwardRef } from "react";
import { LoadingSpinner } from "../icons/LoadingSpinner";

export const InputBoxForJoinRoom = forwardRef(function InputBoxForRoom(
  {
    onClick,
    setUniqueRoomId,
    uniqueRoomId,
    joinRoomLaoding,
    error,
    setError,
  }: {
    onClick: () => void;
    setUniqueRoomId: React.Dispatch<React.SetStateAction<string>>;
    uniqueRoomId: string;
    joinRoomLaoding: any;
    error: any;
    setError: any;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className="absolute z-50 flex items-center justify-center rounded-2xl border border-gray-700 bg-[#161717] p-4"
    >
      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="Enter Room Id"
          value={uniqueRoomId}
          className={`rounded-xl border p-4 text-white outline-none placeholder:text-gray-500 ${error ? "border-red-500" : "border-gray-700"} `}
          onChange={(e) => {
            setUniqueRoomId(e.target.value);
            setError("");
          }}
        />
        {error && <p className="text-red-500">{error}</p>}
        {joinRoomLaoding ? (
          <LoadingSpinner />
        ) : (
          <button
            onClick={onClick}
            className="cursor-pointer rounded-2xl bg-white px-8 py-2"
          >
            Join
          </button>
        )}
      </div>
    </div>
  );
});

export const InputBoxForCreateRoom = forwardRef(function InputBoxForRoom(
  {
    onClick,
    setRoomName,
    roomName,
    createRoomLaoding,
    error,
    setError,
  }: {
    onClick: () => any;
    setRoomName: any;
    roomName: any;
    createRoomLaoding: any;
    error: any;
    setError: any;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <div
      ref={ref}
      className="absolute z-50 flex items-center justify-center rounded-2xl border border-gray-700 bg-[#161717] p-4"
    >
      <div className="flex flex-col items-center gap-4">
        <input
          type="text"
          placeholder="Enter Room Name"
          value={roomName}
          className={`rounded-xl border p-4 text-white outline-none placeholder:text-gray-500 ${
            error ? "border-red-500" : "border-gray-700"
          }`}
          onChange={(e) => {
            setRoomName(e.target.value);
            setError("");
          }}
        />
        {error && <p className="text-red-500">{error}</p>}
        {createRoomLaoding ? (
          <LoadingSpinner />
        ) : (
          <button
            onClick={onClick}
            className="cursor-pointer rounded-2xl bg-white px-8 py-2"
          >
            Create a room
          </button>
        )}
      </div>
    </div>
  );
});
