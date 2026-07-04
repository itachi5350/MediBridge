export default function EmergencyBanner() {
  const contacts = [
    { label: "National Ambulance", number: "108" },
    { label: "AIIMS Helpline", number: "011-26588500" },
    { label: "Health Helpline", number: "104" },
    { label: "Emergency Services", number: "112" },
  ];

  return (
    <div className="bg-red-600 rounded-2xl p-5 mb-4 border border-red-700">
      <h3 className="text-white font-bold text-lg mb-2">
        Seek Medical Help Immediately
      </h3>
      <p className="text-red-100 text-sm mb-4 font-medium">
        Your symptoms may require urgent attention. Please contact emergency
        services or visit the nearest hospital now.
      </p>
    <div className="grid grid-cols-1 gap-2">
  {contacts.map((contact) => (
    <a
      key={contact.number}
      href={`tel:${contact.number}`}
      className="flex items-center justify-between bg-red-700 hover:bg-red-800 rounded-xl px-4 py-3"
    >
      <span className="text-white font-semibold text-sm">
        {contact.label}
      </span>

      <span className="text-white font-bold text-sm bg-red-900 px-3 py-1 rounded-lg">
        {contact.number}
      </span>
    </a>
  ))}
</div>
</div>
  );
}