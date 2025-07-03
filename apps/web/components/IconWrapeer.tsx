import { ReactNode } from "react";

type IconWrapperProps = {
  children: ReactNode;
  className?: string;
};

export const IconWrapper = ({ children, className = "" }: IconWrapperProps) => {
  return (
    <div
      className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 text-gray-300 hover:bg-[#292A2A] ${className} `}
    >
      {children}
    </div>
  );
};
