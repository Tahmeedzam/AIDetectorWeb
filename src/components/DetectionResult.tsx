import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface DetectionResultProps {
  isAI: boolean;
  confidence: number;
  additionalInfo?: string;
  loading?: boolean;
}

const DetectionResult = ({ isAI, confidence, additionalInfo, loading }: DetectionResultProps) => {
  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-primary animate-pulse" />
            <span>Analyzing...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Processing your content...</p>
        </CardContent>
      </Card>
    );
  }

  const confidenceColor = confidence > 0.7 ? "text-destructive" : confidence > 0.4 ? "text-yellow-500" : "text-primary";
  const icon = isAI ? XCircle : CheckCircle;
  const IconComponent = icon;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <IconComponent className={`h-5 w-5 ${isAI ? "text-destructive" : "text-primary"}`} />
          <span>Detection Result</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">AI Generated:</span>
          <Badge variant={isAI ? "destructive" : "default"}>
            {isAI ? "Yes" : "No"}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Confidence:</span>
          <span className={`font-bold ${confidenceColor}`}>
            {(confidence * 100).toFixed(1)}%
          </span>
        </div>

        {additionalInfo && (
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground">{additionalInfo}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DetectionResult;