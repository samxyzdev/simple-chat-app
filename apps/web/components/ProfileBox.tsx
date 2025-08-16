export const ProfileBox = ({
  onClick,
  onMouseLeave,
}: {
  onClick?: () => void;
  onMouseLeave?: any;
}) => {
  return (
    <div
      onMouseLeave={onMouseLeave}
      className="flex h-36 flex-col justify-between rounded-2xl border border-gray-700 bg-[#1D1F1F] p-4 text-gray-200"
    >
      <div>
        <p className="text-md">Sameer Ahmed</p>
        <p className="text-sm text-gray-400">smaeer@gamil.com</p>
      </div>
      <button
        onClick={onClick}
        className="cursor-pointer rounded-xl bg-red-500 px-10 py-2 hover:bg-red-600 active:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};
