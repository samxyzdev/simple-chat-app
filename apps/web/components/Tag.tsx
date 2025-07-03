export const Tag = ({ tagName }: { tagName: string }) => {
  return (
    <p className="flex w-auto items-center justify-center rounded-full border border-gray-800 p-2 text-sm text-gray-300">
      {tagName}
    </p>
  );
};
