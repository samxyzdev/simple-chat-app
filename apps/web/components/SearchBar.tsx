import { SearchIcon } from "../icons/SearchIcon";

export const SearchBar = () => {
  return (
    <div className="relative flex items-center">
      <div className="absolute top-1/2 z-50 -translate-y-1/2 pl-3">
        <SearchIcon />
      </div>
      <input
        className="text-md h-10 w-sm rounded-full bg-[#2E2F2F] pl-11 text-gray-300 outline-none sm:w-3xs lg:w-lg"
        type="text"
        placeholder="Search or start a new chat"
      />
    </div>
  );
};
