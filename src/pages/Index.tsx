
import React, { useState } from 'react';
import AIPrompt from '@/components/AIPrompt';
import Header from '@/components/Header';
import Editor from '@/components/Editor';
import Preview from '@/components/Preview';
import Footer from '@/components/Footer';
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { saveAs } from 'file-saver';
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Lightbulb } from 'lucide-react';
import { generateMermaidDiagram } from '@/utils/api';

const DEFAULT_DIAGRAM = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[Alternative Action]
    C --> E[Result]
    D --> E`;

const Index: React.FC = () => {
  const [code, setCode] = useState(DEFAULT_DIAGRAM);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagramType, setDiagramType] = useState('flowchart');
  const isMobile = useIsMobile();

  const handleCodeChange = (value: string) => {
    setCode(value);
    setError(null);
  };

  const handlePromptChange = (value: string) => {
    setPrompt(value);
  };

  const handleDiagramGenerated = (diagram: string) => {
    setCode(diagram);
    toast({
      title: "Diagram Generated",
      description: "Your diagram has been generated successfully.",
    });
  };

  const handleError = (err: string) => {
    if (err) {
      setError(err);
      toast({
        title: "Rendering Error",
        description: err.length > 100 ? err.substring(0, 100) + '...' : err,
        variant: "destructive",
      });
    } else {
      setError(null);
    }
  };

  const handleExport = () => {
    // Export logic here
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, 'diagram.mmd');
    
    toast({
      title: "Diagram Exported",
      description: "Your diagram has been exported successfully.",
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const diagram = await generateMermaidDiagram(prompt, diagramType);
      handleDiagramGenerated(diagram);
    } catch (error) {
      console.error('Error generating diagram:', error);
      // You could add toast notification here for errors
    } finally {
      setIsGenerating(false);
    }
  };

  const openIdea2Prompt = () => {
    window.open('https://idea2prompt.vercel.app', '_blank');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="responsive-container py-responsive flex-1">
        <div className="space-responsive-y">
          <Header onExport={handleExport} />
          <div className="flex-1 container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-4">
              {isMobile ? (
                <>
                  <Editor 
                    value={code} 
                    onChange={handleCodeChange} 
                    promptValue={prompt}
                    onPromptChange={handlePromptChange}
                  />
                  <div className="flex flex-col xs:flex-row gap-2">
                    <Button 
                      onClick={handleGenerate} 
                      className="w-full h-8 sm:h-9 md:h-10 text-xs sm:text-sm md:text-base bg-purple-600 hover:bg-purple-700" 
                      disabled={isGenerating || !prompt.trim()}
                    >
                      {isGenerating ? "Generating..." : "Generate Diagram"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={openIdea2Prompt}
                      className="flex items-center gap-1 w-full xs:w-auto h-8 sm:h-9 md:h-10 text-xs sm:text-sm md:text-base"
                    >
                      <Lightbulb className="h-4 w-4" />
                      <span>Need Prompts?</span>
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Editor 
                    value={code} 
                    onChange={handleCodeChange} 
                    promptValue={prompt}
                    onPromptChange={handlePromptChange}
                    hidePromptTab={true}
                  />
                  <AIPrompt 
                    onDiagramGenerated={handleDiagramGenerated} 
                  />
                </>
              )}
            </div>
            <div>
              <Preview code={code} onError={handleError} />
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                  <h3 className="font-bold">Error:</h3>
                  <pre className="mt-2 whitespace-pre-wrap">{error}</pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
