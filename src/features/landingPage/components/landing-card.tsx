import { FeatureProps } from "../types";
import { cn } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

export const LandingCard = ({ 
  title, 
  description, 
  icon, 
  iconColorClass, 
  isMain, 
  children
}: FeatureProps) => {
  
  return (
    <Card className={cn(
      "flex flex-col justify-between overflow-hidden border-border transition-all duration-300",
      "bg-card text-card-foreground shadow-sm hover:shadow-md", // Menggunakan variabel dari theme.css
      isMain ? "col-span-12 lg:col-span-8 min-h-[400px]" : "col-span-12 lg:col-span-4"
    )}>
      <CardHeader className="pb-0">
        <div className={cn("flex items-center gap-sm mb-sm font-semibold", iconColorClass)}>
          <span className="material-symbols-outlined">{icon}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] opacity-70">
            {isMain ? "Dashboard Overview" : "Core Feature"}
          </span>
        </div>
        <CardTitle className={cn(
          "tracking-tight text-primary font-bold", 
          isMain ? "text-3xl" : "text-xl"
        )}>
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground pt-2 text-balance">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col justify-end p-6">
        {children ? children : (
          <div className="w-full h-40 bg-muted/50 rounded-lg animate-pulse border border-dashed border-border" />
        )}
      </CardContent>
    </Card>
  );
};