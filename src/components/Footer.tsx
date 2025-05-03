import React from 'react';
import { ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 border-t border-border">
      <div className="container mx-auto flex justify-center items-center text-sm text-muted-foreground">
        <span>Created by </span>
        <a 
          href="https://raufjatoi.vercel.app" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center ml-1 text-primary hover:text-primary/80 transition-colors"
        >
          Abdul Rauf Jatoi
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;