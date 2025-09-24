-- Create table for storing AI detection results
CREATE TABLE public.detection_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL CHECK (content_type IN ('text', 'image', 'video', 'audio')),
  content_text TEXT,
  content_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  ai_score DECIMAL(5,2),
  ai_verdict TEXT,
  analysis_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security but allow public access
ALTER TABLE public.detection_results ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Anyone can view detection results" 
ON public.detection_results 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert detection results" 
ON public.detection_results 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance when fetching recent results
CREATE INDEX idx_detection_results_created_at ON public.detection_results(created_at DESC);