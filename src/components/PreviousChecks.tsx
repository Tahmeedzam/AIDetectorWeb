import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Image, Video, Headphones, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DetectionResult {
  id: string;
  content_type: string;
  content_text?: string;
  content_url?: string;
  file_name?: string;
  file_size?: number;
  ai_score: number;
  ai_verdict: string;
  created_at: string;
}

const PreviousChecks = () => {
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from('detection_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Headphones className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const renderContent = (result: DetectionResult) => {
    if (result.content_type === 'text' && result.content_text) {
      return (
        <div className="mt-2 p-3 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground italic">
            "{result.content_text.length > 200 
              ? result.content_text.substring(0, 200) + '...'
              : result.content_text}"
          </p>
        </div>
      );
    }
    
    if (result.content_type === 'image' && result.content_url) {
      return (
        <div className="mt-2">
          <img 
            src={result.content_url} 
            alt="Analyzed content"
            className="max-w-full max-h-32 rounded-md object-cover"
          />
        </div>
      );
    }
    
    if (result.content_type === 'video' && result.content_url) {
      return (
        <div className="mt-2">
          <video 
            src={result.content_url} 
            className="max-w-full max-h-32 rounded-md"
            controls={false}
            muted
          />
        </div>
      );
    }
    
    if (result.file_name) {
      return (
        <div className="mt-2 p-2 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">📎 {result.file_name}</p>
        </div>
      );
    }
    
    return null;
  };

  const getContentPreview = (result: DetectionResult) => {
    if (result.content_text) {
      return result.content_text.length > 50 
        ? result.content_text.substring(0, 50) + '...'
        : result.content_text;
    }
    if (result.file_name) {
      return result.file_name;
    }
    return 'Content analyzed';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVerdictColor = (verdict: string) => {
    if (verdict.toLowerCase().includes('ai') || verdict.toLowerCase().includes('generated')) {
      return "destructive";
    }
    return "secondary";
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-2">Loading previous checks...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No previous checks found. Start analyzing content to see your history here!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card key={result.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-full bg-secondary">
                  {getIcon(result.content_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium capitalize">{result.content_type} Detection</span>
                    <Badge variant={getVerdictColor(result.ai_verdict)}>
                      {result.ai_verdict}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 truncate">
                    {getContentPreview(result)}
                  </p>
                  {renderContent(result)}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(result.created_at)}
                    </div>
                    {result.file_size && (
                      <span>Size: {(result.file_size / 1024 / 1024).toFixed(2)} MB</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">
                  {(result.ai_score * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  Confidence
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PreviousChecks;