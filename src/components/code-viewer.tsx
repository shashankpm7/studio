'use client';

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeViewerProps {
  code: string;
  highlightedLines?: number[];
}

export default function CodeViewer({ code, highlightedLines = [] }: CodeViewerProps) {
  const lines = code.split('\n');

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border bg-background font-mono text-sm">
      <div className="p-4">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isHighlighted = highlightedLines.includes(lineNumber);
          return (
            <div
              key={lineNumber}
              className={cn(
                "flex items-start transition-colors duration-200",
                isHighlighted ? "bg-primary/10" : "bg-transparent"
              )}
            >
              <span className="w-10 text-right pr-4 text-muted-foreground select-none">
                {lineNumber}
              </span>
              <span className="flex-1 whitespace-pre-wrap break-all">{line}</span>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
