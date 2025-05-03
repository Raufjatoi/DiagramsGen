
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateMermaidDiagram } from '@/utils/api';
import { Loader2, Info, Lightbulb } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface AIPromptProps {
  onDiagramGenerated: (diagram: string) => void;
}

const diagramTypes = [
  { 
    value: 'flowchart', 
    label: 'Flowchart',
    description: 'Visualize a process or workflow with connected nodes'
  },
  { 
    value: 'sequence', 
    label: 'Sequence Diagram',
    description: 'Show interactions between participants in time sequence'
  },
  { 
    value: 'class', 
    label: 'Class Diagram',
    description: 'Represent class structure and relationships in OOP'
  },
  { 
    value: 'er', 
    label: 'Entity Relationship',
    description: 'Model database entities and their relationships'
  },
  { 
    value: 'gantt', 
    label: 'Gantt Chart',
    description: 'Illustrate project schedules and task dependencies'
  },
  { 
    value: 'pie', 
    label: 'Pie Chart',
    description: 'Show proportional data in a circular graph'
  },
  { 
    value: 'state', 
    label: 'State Diagram',
    description: 'Represent states of a system and transitions between them'
  },
  { 
    value: 'journey', 
    label: 'User Journey',
    description: 'Map out user experiences and satisfaction levels'
  },
];

const getPlaceholderForType = (type: string): string => {
  switch (type) {
    case 'flowchart':
      return 'Describe a process flow, e.g., "User registration process with email verification"';
    case 'sequence':
      return 'Describe interactions between systems, e.g., "Payment processing flow between customer, store, and bank"';
    case 'class':
      return 'Describe classes and their relationships, e.g., "Animal hierarchy with Dog and Cat subclasses"';
    case 'er':
      return 'Describe database entities, e.g., "Online store with customers, orders, and products"';
    case 'gantt':
      return 'Describe project timeline, e.g., "Website development project with design, development, and testing phases"';
    case 'pie':
      return 'Describe data distribution, e.g., "Company revenue breakdown by product category"';
    case 'state':
      return 'Describe states and transitions, e.g., "Order processing states from created to delivered"';
    case 'journey':
      return 'Describe user experience, e.g., "Customer journey from discovering to purchasing a product"';
    default:
      return 'Describe the diagram you want to create...';
  }
};

const AIPrompt: React.FC<AIPromptProps> = ({ onDiagramGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagramType, setDiagramType] = useState('flowchart');
  const isMobile = useIsMobile();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const diagram = await generateMermaidDiagram(prompt, diagramType);
      onDiagramGenerated(diagram);
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

  const selectedDiagramType = diagramTypes.find(type => type.value === diagramType);

  return (
    <Card className="w-full">
      <CardContent className="pt-3 sm:pt-4 md:pt-6">
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex items-center gap-1">
                <h3 className="text-sm sm:text-base md:text-lg font-medium">Generate Diagram with AI</h3>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <Select value={diagramType} onValueChange={setDiagramType}>
                  <SelectTrigger className="w-full h-8 sm:h-9 md:h-10 text-xs sm:text-sm md:text-base sm:w-[150px] md:w-[180px]">
                    <SelectValue placeholder="Diagram Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {diagramTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-xs sm:text-sm md:text-base">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent 
                      side="top" 
                      align="center"
                      className="bg-background border border-border text-foreground p-3 rounded-md shadow-md text-xs sm:text-sm max-w-[300px]"
                    >
                      <p>{selectedDiagramType?.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="relative">
              <Textarea
                placeholder={getPlaceholderForType(diagramType)}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={isMobile ? 3 : 4}
                className="resize-none pr-8 text-xs sm:text-sm md:text-base"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button 
                      onClick={openIdea2Prompt}
                      className="absolute right-2 top-2 text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Get prompt ideas"
                    >
                      <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-[180px] sm:max-w-none text-xs sm:text-sm">
                    <p>Need prompts from idea? Visit Idea2Prompt</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex flex-col xs:flex-row gap-2">
            <Button 
              onClick={handleGenerate} 
              className="w-full h-8 sm:h-9 md:h-10 text-xs sm:text-sm md:text-base" 
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  {isMobile ? "Generating..." : "Generating Diagram..."}
                </>
              ) : (
                isMobile ? 'Generate' : 'Generate Diagram'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={openIdea2Prompt}
              className="flex items-center gap-1 w-full xs:w-auto h-8 sm:h-9 md:h-10 text-xs sm:text-sm md:text-base"
            >
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Need Prompts?</span>
              <span className="sm:hidden">Prompts</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIPrompt;
