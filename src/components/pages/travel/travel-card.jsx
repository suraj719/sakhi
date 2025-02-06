import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Calendar } from "lucide-react";

export function TravelCard({
  travel,
  isOwner,
  onApply,
  onViewApplication,
  onViewDetails,
}) {
  return (
    <Card className="w-full cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">
          {travel.source} to {travel.destination}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{travel.date}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{travel.modeOfTravel}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={isOwner ? onViewApplication : onApply}>
          {isOwner ? "View applications" : "Apply"}
        </Button>
        <Button onClick={onViewDetails}>View details</Button>
      </CardFooter>
    </Card>
  );
}
