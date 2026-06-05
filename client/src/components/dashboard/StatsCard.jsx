export default function StatsCard({ title, value, icon, colorClass, trend, trendType = 'up' }) {
  return (
    <div className={`stat-card ${colorClass} page-enter`}>
      <div className="stat-card-header">
        <div className={`stat-icon ${colorClass}`}>{icon}</div>
        {trend !== undefined && (
          <span className={`stat-trend ${trendType}`}>
            {trendType === 'up' ? '↗' : '↘'} {trend}
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
    </div>
  )
}
