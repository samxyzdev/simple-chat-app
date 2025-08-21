import { ReactNode } from "react";

type IconWrapperProps = {
  children: ReactNode;
  className?: string;
  activeTab: any;
  setActiveTab: any;
  tabId: number;
};

export const IconWrapper = ({
  children,
  className = "",
  setActiveTab,
  activeTab,
  tabId,
}: IconWrapperProps) => {
  const tabs = [
    { id: 1, label: "chats" },
    { id: 2, label: "setting" },
    { id: 3, label: "profile" },
    { id: 4, label: "setting" },
  ];
  return (
    <div
      onClick={() => setActiveTab(tabId)}
      className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 text-gray-300 ${activeTab === tabId ? "bg-[#292A2A]" : ""} hover:bg-[#292A2A] ${className} `}
    >
      {children}
    </div>
  );
};
