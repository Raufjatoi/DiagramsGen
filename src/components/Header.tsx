import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/theme-toggle';

interface HeaderProps {
  onExport: () => void;
  onReset?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onExport, onReset }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col xs:flex-row justify-between items-center gap-2 mb-4">
      <div className="flex items-center gap-2">
        <div className="font-bold text-lg sm:text-xl">
          {isMobile ? 'DG' : 'DiagramGEN'}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Beta</span>
          <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded">API Powered</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {onReset && (
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={onReset}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            {!isMobile && "Reset"}
          </Button>
        )}
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          onClick={onExport}
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      </div>
    </div>
  );
};
export default Header;
