import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ApiWarning = () => {
  return (
    <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
      <AlertTriangle className="h-4 w-4 text-yellow-500" />
      <AlertDescription className="text-yellow-700 dark:text-yellow-300">
        <strong>Security Notice:</strong> API keys are embedded in frontend code for prototype purposes. 
        In production, use a secure backend to protect your API credentials.
      </AlertDescription>
    </Alert>
  );
};

export default ApiWarning;