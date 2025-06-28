import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import type { Vulnerability } from "@/types";

interface SeverityIconProps {
  severity: Vulnerability['severity'];
  className?: string;
}

export const SeverityIcon = ({ severity, className }: SeverityIconProps) => {
  switch (severity) {
    case 'High':
      return <ShieldAlert className={`text-destructive ${className}`} />;
    case 'Medium':
      return <ShieldCheck className={`text-yellow-500 ${className}`} />;
    case 'Low':
      return <Shield className={`text-blue-500 ${className}`} />;
    default:
      return <Shield className={`text-muted-foreground ${className}`} />;
  }
};
