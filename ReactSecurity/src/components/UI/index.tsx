import React from "react";
import { useLibreria } from "../context/LibreriaContext.tsx";
// MUI imports (ok if available in the project)
import MuiButton from "@mui/material/Button";

type ButtonVariant = "primary" | "secondary" | "danger" | "text";

interface UIButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<UIButtonProps> = ({ variant = "primary", size = "md", className = "", children, ...rest }) => {
  const { libreria } = useLibreria();

  // size mapping
  const sizeClass = size === "sm" ? "px-3 py-1 text-sm" : size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm";

  if (libreria === "ui") {
    // Material UI
    const color = variant === "danger" ? "error" : variant === "secondary" ? "secondary" : "primary";
    return (
      // @ts-ignore allow passing children
      <MuiButton color={color as any} variant={variant === "text" ? "text" : "contained"} size={size === "sm" ? "small" : size === "lg" ? "large" : "medium"} {...(rest as any)}>
        {children}
      </MuiButton>
    );
  }

  if (libreria === "bootstrap") {
    const map = {
      primary: "btn btn-warning",
      secondary: "btn btn-secondary",
      danger: "btn btn-outline-danger",
      text: "btn btn-link",
    } as Record<ButtonVariant, string>;
    return (
      <button className={`${map[variant]} ${className}`} {...rest}>
        {children}
      </button>
    );
  }

  // Default: Tailwind
  const twMap: Record<ButtonVariant, string> = {
    primary: `btn-primary ${sizeClass}`,
    secondary: `bg-gray-100 text-gray-800 ${sizeClass}`,
    danger: `bg-red-500 text-white ${sizeClass}`,
    text: `text-sm text-primary ${sizeClass}`,
  };

  return (
    <button className={`${twMap[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
};

interface UIInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export const Input: React.FC<UIInputProps> = ({ className = "", ...rest }) => {
  const { libreria } = useLibreria();

  if (libreria === "ui") {
    // keep simple HTML input to avoid adding MUI TextField dependency here
    return <input className={`px-3 py-2 rounded border ${className}`} {...rest} />;
  }

  if (libreria === "bootstrap") {
    return <input className={`form-control ${className}`} {...rest} />;
  }

  // tailwind
  return <input className={`w-full border rounded p-2 ${className}`} {...rest} />;
};

const UI = { Button, Input };
export default UI;
