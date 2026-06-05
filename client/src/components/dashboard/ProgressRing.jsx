export default function ProgressRing({ percentage = 0, title, description }) {
  const radius = 60
  const stroke = 12
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="progress-ring-card page-enter">
      <div className="progress-ring-wrap">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="progress-ring-svg"
        >
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-purple-light)" />
              <stop offset="100%" stopColor="var(--accent-cyan)" />
            </linearGradient>
          </defs>
          <circle
            className="progress-ring-track"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            className="progress-ring-fill"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="progress-ring-center">
          <span className="progress-ring-pct">{percentage}%</span>
          <span className="progress-ring-sub">Done</span>
        </div>
      </div>

      <div className="progress-ring-info">
        <h3 className="progress-ring-title text-primary">{title}</h3>
        <p className="progress-ring-desc text-muted">{description}</p>
      </div>
    </div>
  )
}
