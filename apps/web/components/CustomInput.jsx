"use client";

export default function Input({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  type,
  error,
  onBlur,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm" htmlFor={id}>
        {label}
      </label>
      <div className="w-full rounded-lg border">
        <input
          className="w-full p-2"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type={type}
          onBlur={onBlur}
        />
      </div>
      <p className="min-h-2 text-[11px] text-red-600">{error && `${error}`}</p>
      {id === "password" ? (
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <p>Number </p>
            <RightClick value={value} regex={/[0-9]/} />
          </div>
          <div className="flex items-center gap-1">
            <p>Uppercase latter</p>
            <RightClick value={value} regex={/[A-Z]/} />
          </div>
          <div className="flex items-center gap-1">
            <p>Lowercase latter</p>
            <RightClick value={value} regex={/[a-z]/} />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export const RightClick = ({ value, regex }) => {
  const passed = regex.test(String(value || ""));
  return (
    <svg
      height="18"
      width="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className={`size-2.5 ${passed ? "text-green-500" : "text-neutral-300"} transition-opacity`}
    >
      <g fill="currentColor">
        <path
          d="M9,1C4.589,1,1,4.589,1,9s3.589,8,8,8,8-3.589,8-8S13.411,1,9,1Zm3.843,5.708l-4.25,5.5c-.136,.176-.343,.283-.565,.291-.01,0-.019,0-.028,0-.212,0-.415-.09-.558-.248l-2.25-2.5c-.277-.308-.252-.782,.056-1.06,.309-.276,.781-.252,1.06,.056l1.648,1.832,3.701-4.789c.253-.328,.725-.388,1.052-.135,.328,.253,.388,.724,.135,1.052Z"
          fill="currentColor"
        ></path>
      </g>
    </svg>
  );
};
