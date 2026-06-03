import { LucideIcon } from "lucide-react";

interface PremiumIconProps {
  icon: LucideIcon;
  gradient: string;
  size?: "sm" | "md" | "lg" | "xl";
  shadow?: boolean;
}

const sizeMap = {
  sm: { box: "w-10 h-10", icon: "w-5 h-5", rounded: "rounded-lg" },
  md: { box: "w-12 h-12", icon: "w-6 h-6", rounded: "rounded-xl" },
  lg: { box: "w-16 h-16", icon: "w-8 h-8", rounded: "rounded-2xl" },
  xl: { box: "w-20 h-20", icon: "w-10 h-10", rounded: "rounded-2xl" },
};

const gradientMap = {
  indigo: "bg-gradient-to-br from-indigo-500 to-purple-600",
  cyan: "bg-gradient-to-br from-cyan-500 to-blue-600",
  emerald: "bg-gradient-to-br from-emerald-500 to-teal-600",
  green: "bg-gradient-to-br from-green-500 to-emerald-600",
  blue: "bg-gradient-to-br from-blue-500 to-cyan-600",
  amber: "bg-gradient-to-br from-amber-500 to-orange-600",
  purple: "bg-gradient-to-br from-purple-500 to-pink-600",
  red: "bg-gradient-to-br from-red-500 to-rose-600",
  orange: "bg-gradient-to-br from-orange-500 to-red-600",
  pink: "bg-gradient-to-br from-pink-500 to-purple-600",
  teal: "bg-gradient-to-br from-teal-500 to-cyan-600",
  lime: "bg-gradient-to-br from-lime-500 to-green-600",
  violet: "bg-gradient-to-br from-violet-500 to-purple-600",
  sky: "bg-gradient-to-br from-sky-500 to-blue-600",
};

export function PremiumIcon({
  icon: Icon,
  gradient,
  size = "md",
  shadow = true
}: PremiumIconProps) {
  const sizes = sizeMap[size];
  const gradientClass = gradientMap[gradient as keyof typeof gradientMap] || gradientMap.indigo;
  const shadowClass = shadow ? "shadow-lg" : "";

  return (
    <div className={`${sizes.box} ${sizes.rounded} ${gradientClass} flex items-center justify-center ${shadowClass} transition-transform hover:scale-105`}>
      <Icon className={`${sizes.icon} text-white`} strokeWidth={2.5} />
    </div>
  );
}
