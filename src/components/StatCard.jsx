function StatCard({
  icon: Icon,
  title,
  value,
  description,
  warning = false,
}) {
  return (
    <div className={`stat-card ${warning ? "stat-card-warning" : ""}`}>
      <div className="stat-icon">
        {Icon && <Icon size={22} />}
      </div>

      <div className="stat-content">
        <p>{title}</p>

        <h3>{value ?? 0}</h3>

        {description && (
          <small>{description}</small>
        )}
      </div>
    </div>
  );
}

export default StatCard;