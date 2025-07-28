import { SearchIcon } from "../icons/SearchIcon";

export const SearchBar = () => {
  return (
    <div className="flex items-center rounded-full bg-[#2E2F2F] px-4 py-2">
      <div className="mr-2 text-white">
        <SearchIcon />
      </div>
      <input
        // className="text-md mx-auto h-10 w-sm rounded-full bg-[#2E2F2F] pl-11 text-gray-300 outline-none sm:w-3xs lg:w-lg"
        className="text-gray-300 outline-none placeholder:text-gray-400"
        type="text"
        placeholder="Search or start a new chat"
      />
    </div>
  );
};
