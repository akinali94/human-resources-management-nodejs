type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};
export default function SearchInput({ value, onChange, placeholder }: Props) {
  return (
    <input
      className="search"
      type="search"
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      placeholder={placeholder ?? "Search…"}
    />
  );
}
