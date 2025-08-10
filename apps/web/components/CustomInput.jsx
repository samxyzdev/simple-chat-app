export default function Input({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  type,
  error,
}) {
  return (
    <div className="w-full rounded-lg border">
      {/* <label htmlFor={id}>{label}</label> */}
      <input
        className="w-full p-2"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
      />
      {/* <p className="error">{error}</p> */}
    </div>
  );
}
