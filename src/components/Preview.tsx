import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTheme } from '@/components/theme-provider';
import { Button } from "@/components/ui/button";

interface PreviewProps {
  code: string;
  onError: (error: string) => void;
}

const Preview: React.FC<PreviewProps> = ({ code, onError }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const [initialized, setInitialized] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Initialize mermaid only once at component mount
  useEffect(() => {
    if (!initialized) {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'default', // Always use light theme
          securityLevel: 'loose',
          flowchart: {
            htmlLabels: true,
            curve: 'basis'
          },
          sequence: {
            actorMargin: 50,
            boxMargin: 10,
            mirrorActors: false,
            bottomMarginAdj: 1
          },
          fontSize: isMobile ? 14 : 16,
          logLevel: 'error'
        });
        setInitialized(true);
      } catch (error) {
        console.error('Mermaid initialization error:', error);
        onError(error instanceof Error ? error.message : String(error));
      }
    }
  }, [initialized, isMobile, theme, onError]);

  // Render diagram when code changes or theme changes
  useEffect(() => {
    if (!initialized || !code || !containerRef.current) return;
    
    const renderDiagram = async () => {
      try {
        // Clear previous content and errors
        containerRef.current!.innerHTML = '';
        onError('');
        
        // Create a container for the diagram
        const tempContainer = document.createElement('div');
        tempContainer.style.display = 'none';
        document.body.appendChild(tempContainer);
        
        // Generate a unique ID
        const id = `mermaid-${Date.now()}`;
        
        // Use mermaidAPI directly for more control
        const { svg } = await mermaid.mermaidAPI.render(id, code);
        
        // Insert the SVG into the container
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          
          // Apply theme-specific styles to SVG elements
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';
            
            // Center the SVG in the container
            svgElement.style.display = 'block';
            svgElement.style.margin = '0 auto';
            
            // Apply zoom level
            svgElement.style.transform = `scale(${zoomLevel})`;
            svgElement.style.transformOrigin = 'center center';
            svgElement.style.transition = 'transform 0.2s ease-in-out';
            
            // Add theme-specific class to the SVG
            if (theme === 'dark') {
              svgElement.classList.add('dark-theme');
            } else {
              svgElement.classList.add('light-theme');
            }
          }
        }
        
        // Clean up
        document.body.removeChild(tempContainer);
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        onError(error instanceof Error ? error.message : String(error));
      }
    };
    
    // Add a small delay to ensure the DOM is ready
    const timer = setTimeout(() => {
      renderDiagram();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [code, initialized, theme, zoomLevel, onError]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <Card className="w-full h-full min-h-[400px] overflow-hidden relative">
      <CardContent className="p-0 h-full">
        <div className="diagram-container h-full flex items-center justify-center">
          {!initialized ? (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p>Initializing diagram renderer...</p>
            </div>
          ) : !code ? (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <p>Enter diagram code to render</p>
            </div>
          ) : (
            <div 
              ref={containerRef} 
              className="w-full h-full overflow-auto p-4 flex items-center justify-center"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />
          )}
        </div>
        
        {/* Zoom controls */}
        {initialized && code && (
          <div className="absolute bottom-4 right-4 flex gap-2 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleZoomOut} 
              className="h-8 w-8"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleResetZoom} 
              className="h-8 w-8"
              title="Reset Zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleZoomIn} 
              className="h-8 w-8"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Preview;
