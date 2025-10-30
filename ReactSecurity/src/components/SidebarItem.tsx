import React from "react";

interface SidebarItemProps {
  label: string;
  collapsed: boolean;
  active?: boolean;
  onClick: () => void;
  id?: string;
}

// Single Responsibility: this component only renders a sidebar item and
// exposes onClick. Styling and ARIA are encapsulated here.
export default function SidebarItem({ label, collapsed, active = false, onClick, id }: SidebarItemProps) {
  const className = `flex items-center w-full text-left px-3 py-2 rounded transition-colors text-sm focus:outline-none ${
    collapsed ? "justify-center" : "justify-start"
  } ${
    active
      ? "bg-primary text-white dark:bg-primary"
      : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100"
  }`;

  return (
    <button
      id={id}
      onClick={onClick}
      title={label}
      className={className}
      aria-current={active ? "page" : undefined}
    >
      <span className="font-medium">{collapsed ? label.charAt(0) : label}</span>
    </button>
  );
}
