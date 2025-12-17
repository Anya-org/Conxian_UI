import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtext?: string;
}

export const StatCard = ({ title, value, icon, subtext }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
    </CardContent>
  </Card>
);
