export interface FeatureProps {
  title: string;
  description: string;
  icon: string;
  iconColorClass: string;
  isMain?: boolean;
  children?: React.ReactNode;
}
