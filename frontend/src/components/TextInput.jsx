export default function TextInput({ value, onChange, disabled }) {
  const max = 300;

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Describe your symptoms here... e.g. sir mein dard hai, bukhar hai"
        maxLength={max}
        rows={4}
        className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   disabled:bg-gray-50 disabled:text-gray-400"
      />
      <p className="text-xs text-gray-400 text-right mt-1">
        {value.length}/{max}
      </p>
    </div>
  );
}