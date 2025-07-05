import { MenuIcon } from "../icons/MenuIcon";
import { ProfileIcon, ProfileIconFromWhatsApp } from "../icons/ProfileIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { IconWrapper } from "./IconWrapeer";

export const MessageWindow = ({ selectedRoom }: { selectedRoom: any }) => {
  return (
    <section className="hidden flex-1 flex-col bg-[#161717] bg-[url('../images/background.png')] bg-blend-soft-light sm:flex">
      {/* Header */}
      <MessageWindowHeader roomId={selectedRoom.roomId} />

      {/* Chat area (for future messages) */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {/* Your chat messages will go here */}
        <p className="text-white">Chat messages go here</p>
        <p className="text-white">Chat For Room : {selectedRoom.roomId}</p>
      </div>

      {/* Input at bottom */}
      <div className="px-4 pb-3">
        <MessageInputBard />
      </div>
    </section>
  );
};

function MessageWindowHeader({ roomId }: { roomId: string }) {
  return (
    <div className="flex h-16 justify-between bg-[#161717] bg-fixed px-4 py-3 text-white">
      <div className="flex items-center gap-4">
        <ProfileIconFromWhatsApp />
        <div className="">
          <h1 className="font-bold">THEQ DSLKJFOSID</h1>
          <p className="text-xs text-gray-300">
            Last seen yesterday at 5:34 pm
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div>
          <SearchIcon />
        </div>
        <div>
          <MenuIcon />
        </div>
      </div>
    </div>
  );
}

function MessageInputBard() {
  return (
    <div className="flex w-full items-center gap-3 rounded-3xl bg-[#242626] px-4 py-2 text-white">
      {/* Left section: Plus + Smiley + Input */}
      <div className="flex flex-1 items-center gap-2">
        {/* Icons */}
        <IconWrapper>
          <PlusIconFromWhatsApp />
        </IconWrapper>
        <IconWrapper>
          <SmileyIconFromWhatsApp />
        </IconWrapper>

        {/* Input box that grows */}
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 bg-transparent placeholder:text-gray-400 focus:outline-none"
        />
      </div>

      {/* Right section: Mic icon */}
      <IconWrapper>
        <MicIconFromWhatsApp />
      </IconWrapper>
    </div>
  );
}

function MicIconFromWhatsApp() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      preserveAspectRatio="xMidYMid meet"
      className=""
    >
      <title>mic-outlined</title>
      <path
        d="M12 14C11.1667 14 10.4583 13.7083 9.875 13.125C9.29167 12.5417 9 11.8333 9 11V5C9 4.16667 9.29167 3.45833 9.875 2.875C10.4583 2.29167 11.1667 2 12 2C12.8333 2 13.5417 2.29167 14.125 2.875C14.7083 3.45833 15 4.16667 15 5V11C15 11.8333 14.7083 12.5417 14.125 13.125C13.5417 13.7083 12.8333 14 12 14ZM12 21C11.4477 21 11 20.5523 11 20V17.925C9.26667 17.6917 7.83333 16.9167 6.7 15.6C5.78727 14.5396 5.24207 13.3387 5.06441 11.9973C4.9919 11.4498 5.44772 11 6 11C6.55228 11 6.98782 11.4518 7.0905 11.9945C7.27271 12.9574 7.73004 13.805 8.4625 14.5375C9.4375 15.5125 10.6167 16 12 16C13.3833 16 14.5625 15.5125 15.5375 14.5375C16.27 13.805 16.7273 12.9574 16.9095 11.9945C17.0122 11.4518 17.4477 11 18 11C18.5523 11 19.0081 11.4498 18.9356 11.9973C18.7579 13.3387 18.2127 14.5396 17.3 15.6C16.1667 16.9167 14.7333 17.6917 13 17.925V20C13 20.5523 12.5523 21 12 21ZM12 12C12.2833 12 12.5208 11.9042 12.7125 11.7125C12.9042 11.5208 13 11.2833 13 11V5C13 4.71667 12.9042 4.47917 12.7125 4.2875C12.5208 4.09583 12.2833 4 12 4C11.7167 4 11.4792 4.09583 11.2875 4.2875C11.0958 4.47917 11 4.71667 11 5V11C11 11.2833 11.0958 11.5208 11.2875 11.7125C11.4792 11.9042 11.7167 12 12 12Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

function PlusIconFromWhatsApp() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      preserveAspectRatio="xMidYMid meet"
      className="x11xpdln x1d8287x x1h4ghdb"
      fill="none"
    >
      <title>plus-rounded</title>
      <path
        d="M11 13H5.5C4.94772 13 4.5 12.5523 4.5 12C4.5 11.4477 4.94772 11 5.5 11H11V5.5C11 4.94772 11.4477 4.5 12 4.5C12.5523 4.5 13 4.94772 13 5.5V11H18.5C19.0523 11 19.5 11.4477 19.5 12C19.5 12.5523 19.0523 13 18.5 13H13V18.5C13 19.0523 12.5523 19.5 12 19.5C11.4477 19.5 11 19.0523 11 18.5V13Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

function SmileyIconFromWhatsApp() {
  return (
    <svg
      viewBox="0 0 24 24"
      height="24"
      width="24"
      preserveAspectRatio="xMidYMid meet"
      className=""
      fill="none"
    >
      <title>expressions</title>
      <path
        d="M8.49893 10.2521C9.32736 10.2521 9.99893 9.5805 9.99893 8.75208C9.99893 7.92365 9.32736 7.25208 8.49893 7.25208C7.6705 7.25208 6.99893 7.92365 6.99893 8.75208C6.99893 9.5805 7.6705 10.2521 8.49893 10.2521Z"
        fill="currentColor"
      ></path>
      <path
        d="M17.0011 8.75208C17.0011 9.5805 16.3295 10.2521 15.5011 10.2521C14.6726 10.2521 14.0011 9.5805 14.0011 8.75208C14.0011 7.92365 14.6726 7.25208 15.5011 7.25208C16.3295 7.25208 17.0011 7.92365 17.0011 8.75208Z"
        fill="currentColor"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.8221 19.9799C15.5379 21.2537 13.8087 21.9781 12 22H9.27273C5.25611 22 2 18.7439 2 14.7273V9.27273C2 5.25611 5.25611 2 9.27273 2H14.7273C18.7439 2 22 5.25611 22 9.27273V11.8141C22 13.7532 21.2256 15.612 19.8489 16.9776L16.8221 19.9799ZM14.7273 4H9.27273C6.36068 4 4 6.36068 4 9.27273V14.7273C4 17.6393 6.36068 20 9.27273 20H11.3331C11.722 19.8971 12.0081 19.5417 12.0058 19.1204L11.9935 16.8564C11.9933 16.8201 11.9935 16.784 11.9941 16.7479C11.0454 16.7473 10.159 16.514 9.33502 16.0479C8.51002 15.5812 7.84752 14.9479 7.34752 14.1479C7.24752 13.9479 7.25585 13.7479 7.37252 13.5479C7.48919 13.3479 7.66419 13.2479 7.89752 13.2479L13.5939 13.2479C14.4494 12.481 15.5811 12.016 16.8216 12.0208L19.0806 12.0296C19.5817 12.0315 19.9889 11.6259 19.9889 11.1248V9.07648H19.9964C19.8932 6.25535 17.5736 4 14.7273 4ZM14.0057 19.1095C14.0066 19.2605 13.9959 19.4089 13.9744 19.5537C14.5044 19.3124 14.9926 18.9776 15.4136 18.5599L18.4405 15.5576C18.8989 15.1029 19.2653 14.5726 19.5274 13.996C19.3793 14.0187 19.2275 14.0301 19.0729 14.0295L16.8138 14.0208C15.252 14.0147 13.985 15.2837 13.9935 16.8455L14.0057 19.1095Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

// w-full tries to take 100% of the parent width, not 100% of remaining width, so it overflows.

//
