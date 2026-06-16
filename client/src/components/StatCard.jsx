export default function StatCard({ title, value, unit, icon }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-3xl font-bold text-primary">{value}</p>
          <p className="text-gray-500 text-xs mt-1">{unit}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
