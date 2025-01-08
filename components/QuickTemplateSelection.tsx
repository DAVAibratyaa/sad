"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Template, defaultTemplates, searchTemplates } from "../lib/defaultTemplates";
import { useState, useCallback, useMemo } from "react";

interface QuickTemplateSelectionProps {
  activeSection: string;
  onTemplateSelect: (template: Template) => void;
}

export function QuickTemplateSelection({
  activeSection,
  onTemplateSelect,
}: QuickTemplateSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    if (!searchQuery) {
      return defaultTemplates.filter(
        template => template.category === activeSection || 
        template.category === "chest" // Always show general chest templates
      );
    }
    return searchTemplates(searchQuery);
  }, [searchQuery, activeSection]);

  const handleTemplateClick = useCallback((template: Template) => {
    onTemplateSelect(template);
  }, [onTemplateSelect]);

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search templates..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />
      <ScrollArea className="h-[calc(100vh-20rem)]">
        <div className="space-y-2 pr-4">
          {filteredTemplates.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No templates found
            </p>
          ) : (
            filteredTemplates.map((template) => (
              <Button
                key={template.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleTemplateClick(template)}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{template.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {template.content.length > 60
                      ? template.content.slice(0, 60) + "..."
                      : template.content}
                  </span>
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
