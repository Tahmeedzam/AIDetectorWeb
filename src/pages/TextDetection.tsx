import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import DetectionResult from "@/components/DetectionResult";
import ApiWarning from "@/components/ApiWarning";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const TextDetection = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{
    isAI: boolean;
    confidence: number;
    additionalInfo?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyzeText = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Call Sapling AI Detection API
      const response = await fetch("https://api.sapling.ai/api/v1/aidetect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "0PJZDPJO5JM5HS1WVI27WBA7AGCGCU24",
          text: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const confidence = data.score || 0;
      const isAI = confidence > 0.5;
      const verdict = isAI ? "AI Generated" : "Human Written";
      
      // Save to Supabase
      await supabase.from('detection_results').insert({
        content_type: 'text',
        content_text: text,
        ai_score: confidence,
        ai_verdict: verdict,
        analysis_details: { api_response: data, character_count: text.length }
      });
      
      setResult({
        isAI,
        confidence,
        additionalInfo: `Text analysis complete. ${text.length} characters analyzed. API confidence score: ${(confidence * 100).toFixed(1)}%`,
      });
    } catch (error) {
      console.error("API Error:", error);
      toast({
        title: "Error",
        description: "Failed to analyze text. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Text AI Detection
            </h1>
            <p className="text-muted-foreground">
              Analyze text content to detect AI-generated writing patterns
            </p>
          </div>

          <ApiWarning />

          <Card>
            <CardHeader>
              <CardTitle>Enter Text to Analyze</CardTitle>
              <CardDescription>
                Paste or type the text you want to check for AI generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
                className="resize-none"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{text.length} characters</span>
                <span>{text.split(/\s+/).filter(word => word.length > 0).length} words</span>
              </div>
              <Button 
                onClick={analyzeText} 
                disabled={loading || !text.trim()}
                className="w-full"
              >
                {loading ? "Analyzing..." : "Analyze Text"}
              </Button>
            </CardContent>
          </Card>

          {(result || loading) && (
            <DetectionResult
              isAI={result?.isAI || false}
              confidence={result?.confidence || 0}
              additionalInfo={result?.additionalInfo}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TextDetection;