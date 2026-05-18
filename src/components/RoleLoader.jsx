function RoleLoader({ role }) {
  const roleConfig = {
    Admin: {
      title: "Admin Access",
      subtitle: "Loading management dashboard...",
      icon: "🛡️",
      badge: "ADMIN",
    },
    Professor: {
      title: "Professor Portal",
      subtitle: "Preparing paper submission workspace...",
      icon: "📘",
      badge: "PROFESSOR",
    },
    "Department Head": {
      title: "Approval Desk",
      subtitle: "Loading department approval panel...",
      icon: "✅",
      badge: "HEAD",
    },
    "Academic Officer": {
      title: "DAO Governance",
      subtitle: "Loading academic integrity governance...",
      icon: "⚖️",
      badge: "DAO",
    },
    "Public User": {
      title: "Verification Portal",
      subtitle: "Opening paper verification system...",
      icon: "🔍",
      badge: "PUBLIC",
    },
  };

  const current = roleConfig[role] || {
    title: "Loading Portal",
    subtitle: "Preparing your workspace...",
    icon: "✨",
    badge: "USER",
  };

  return (
    <div className="role-loader-overlay">
      <div className="role-loader-card">
        <div className="role-loader-icon">{current.icon}</div>
        <div className="role-loader-badge">{current.badge}</div>
        <h2>{current.title}</h2>
        <p>{current.subtitle}</p>

        <div className="loader-bar">
          <div className="loader-fill"></div>
        </div>
      </div>
    </div>
  );
}

export default RoleLoader;