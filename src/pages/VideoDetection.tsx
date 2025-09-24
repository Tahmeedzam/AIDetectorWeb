import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Upload } from "lucide-react";
import DetectionResult from "@/components/DetectionResult";
import { useToast } from "@/hooks/use-toast";

const VideoDetection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Error",
          description: "Please select a valid video file",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Video must be smaller than 100MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      setResult(null);
    }
  };

  const analyzeVideo = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a video first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // 🚀 Send video to your FastAPI backend instead of Sightengine
      const response = await fetch(
  "https://video-detection-backend.onrender.com/detect-video",
  {
    method: "POST",
    body: formData,
  }
);

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend video analysis result:", data);

      setResult({
        isAI: data.ai_detected ?? false,
        confidence: data.confidence ?? 0,
        additionalInfo: `Frames analyzed: ${data.frames_checked}, File: ${data.filename}`,
      });

      toast({
        title: "Success",
        description: "Video analyzed successfully",
      });
    } catch (error: any) {
      console.error("Error analyzing video:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Video className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Video AI Detection
            </h1>
            <p className="text-muted-foreground">
              Upload a video to detect AI-generated content
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upload Video</CardTitle>
              <CardDescription>
                Supports MP4, MOV, AVI up to 100MB
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div
                onClick={triggerFileSelect}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <Video className="h-16 w-16 text-primary mx-auto" />
                    <div>
                      <p className="text-lg font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Choose Different Video
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <p className="text-lg font-medium">Click to upload video</p>
                      <p className="text-sm text-muted-foreground">
                        MP4, MOV, AVI up to 100MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={analyzeVideo}
                disabled={loading || !selectedFile}
                className="w-full"
              >
                {loading ? "Analyzing Video..." : "Analyze Video"}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <DetectionResult
              isAI={result.isAI}
              confidence={result.confidence}
              additionalInfo={result.additionalInfo}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetection;
