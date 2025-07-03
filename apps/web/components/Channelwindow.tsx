import { MenuIcon } from "../icons/MenuIcon";
import { NewchatIcon } from "../icons/NewchatIcon";
import { ChannelCard } from "./ChannelCard";
import { IconWrapper } from "./IconWrapeer";
import { SearchBar } from "./SearchBar";
import { Tag } from "./Tag";

const TagElement = ["ALL", "Unread", "Favourites", "Groups"];
const ChannelCardElement = [
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
  { name: "SAMEER AHMED", lastMessage: "hey", time: "10:30 pm" },
];

export const Channelwindow = () => {
  return (
    <section className="w-xl border-r border-gray-700 bg-[#161717]">
      <ChannelHeader />
      <div className="flex justify-center">
        <IconWrapper>
          <SearchBar />
        </IconWrapper>
      </div>
      <div className="flex justify-start space-x-2 p-2">
        {TagElement.map((tag, idx) => (
          <Tag key={idx} tagName={tag} />
        ))}
      </div>
      <div className="no-scrollbar max-h-[790px] overflow-y-auto p-3">
        {ChannelCardElement.map((element, idx) => (
          <ChannelCard
            key={idx}
            name={element.name}
            lastMessage={element.lastMessage}
            time={element.time}
          />
        ))}
      </div>
    </section>
  );
};

function ChannelHeader() {
  return (
    <div className="flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold text-white">WhatsApp</h1>
      <div className="flex gap-4">
        <div className="text-white">
          <IconWrapper>
            <NewchatIcon />
          </IconWrapper>
        </div>
        <div className="text-white">
          <IconWrapper>
            <MenuIcon />
          </IconWrapper>
        </div>
      </div>
    </div>
  );
}
