export default function StatCard({ label, value, icon, accent = '#28C3BE' }) {
  return (
    <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow-sm">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ backgroundColor: accent + '20' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-ink-black">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}
