
import React from "react";
import { Shield, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlareVerificationBadgeProps {
  isVerified: boolean;
  className?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  providerId?: string;
  onClick?: () => void;
}

const FlareVerificationBadge: React.FC<FlareVerificationBadgeProps> = ({
  isVerified,
  className,
  showLabel = true,
  size = "md",
  providerId,
  onClick
}) => {
  const sizeClasses = {
    sm: "text-xs py-0.5 px-1.5",
    md: "text-sm py-1 px-2",
    lg: "text-base py-1.5 px-3"
  };
  
  const handleExplorer = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open("https://coston2-explorer.flare.network/address/0xfC3E77Ef092Fe649F3Dbc22A11aB8a986d3a2F2F", "_blank");
  };
  
  if (!isVerified) return null;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-1.5 rounded-full border cursor-pointer",
        isVerified ? "bg-green-500/10 text-green-600 border-green-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20",
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      <Shield className={cn("flex-shrink-0", size === "sm" ? "h-3 w-3" : size === "md" ? "h-3.5 w-3.5" : "h-4 w-4")} />
      {showLabel && (
        <span className="truncate">
          {providerId ? `${providerId} Verified` : "Flare Verified"}
        </span>
      )}
      <ExternalLink 
        className={cn("cursor-pointer opacity-70 hover:opacity-100", 
          size === "sm" ? "h-3 w-3" : size === "md" ? "h-3.5 w-3.5" : "h-4 w-4"
        )}
        onClick={handleExplorer}
      />
    </div>
  );
};

export default FlareVerificationBadge;
