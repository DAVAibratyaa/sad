"use client";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { VoiceRecorder } from "./VoiceRecorder";
import { QuickTemplateSelection } from "./QuickTemplateSelection";
import { Template } from "@/lib/defaultTemplates";
import { useState, useCallback } from "react";

interface SectionContent {
  content: string;
  lastModified: Date;
}

type ReportSections = {
  [key: string]: SectionContent;
};

export function RadiologyReportInterface() {
  const [activeSection, setActiveSection] = useState("findings");
  const [sections, setSections] = useState<ReportSections>({
    procedure: { content: "", lastModified: new Date() },
    history: { content: "", lastModified: new Date() },
    technique: { content: "", lastModified: new Date() },
    comparison: { content: "", lastModified: new Date() },
    findings: { content: "", lastModified: new Date() },
    impression: { content: "", lastModified: new Date() },
  });

  const handleTranscriptionComplete = useCallback((text: string) => {
    setSections(prev => ({
      ...prev,
      [activeSection]: {
        content: prev[activeSection].content + (prev[activeSection].content ? "\n" : "") + text,
        lastModified: new Date()
      }
    }));
  }, [activeSection]);

  const handleTextChange = useCallback((content: string) => {
    setSections(prev => ({
      ...prev,
      [activeSection]: {
        content,
        lastModified: new Date()
      }
    }));
  }, [activeSection]);

  const handleTemplateSelect = useCallback((template: Template) => {
    setSections(prev => ({
      ...prev,
      [activeSection]: {
        content: prev[activeSection].content + (prev[activeSection].content ? "\n" : "") + template.content,
        lastModified: new Date()
      }
    }));
  }, [activeSection]);

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-border bg-card p-4">
        <div className="space-y-2">
          {Object.keys(sections).map((section) => (
            <Button 
              key={section}
              variant={activeSection === section ? "default" : "ghost"} 
              className="w-full justify-start capitalize"
              onClick={() => setActiveSection(section)}
            >
              {section}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full">
          <div className="flex-1 p-4">
            <div className="mb-4 flex items-center space-x-2">
              <Button variant="outline" size="icon">
                <span className="font-bold">B</span>
              </Button>
              <Button variant="outline" size="icon">
                <span className="italic">I</span>
              </Button>
              <Button variant="outline" size="icon">
                <span>≡</span>
              </Button>
              <Button variant="outline" size="icon">
                <span>⇔</span>
              </Button>
              <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
            </div>
            <ScrollArea className="h-[calc(100vh-8rem)] rounded-md border p-4">
              <textarea
                className="min-h-[calc(100vh-10rem)] w-full resize-none bg-transparent p-2 focus:outline-none"
                placeholder="Start typing or use voice input..."
                value={sections[activeSection].content}
                onChange={(e) => handleTextChange(e.target.value)}
              />
            </ScrollArea>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 border-l border-border bg-card p-4">
            <Tabs defaultValue="study">
              <TabsList className="w-full">
                <TabsTrigger value="study" className="flex-1">Study</TabsTrigger>
                <TabsTrigger value="templates" className="flex-1">Templates</TabsTrigger>
              </TabsList>
              <TabsContent value="study">
                <Card className="p-4">
                  <h3 className="mb-2 font-semibold">Study Information</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium">Study ID</label>
                      <p className="text-sm text-muted-foreground">RAD0111</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Patient Name</label>
                      <p className="text-sm text-muted-foreground">John Doe</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Patient ID</label>
                      <p className="text-sm text-muted-foreground">P12345</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Study Type</label>
                      <p className="text-sm text-muted-foreground">Chest X-Ray</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Study Date</label>
                      <p className="text-sm text-muted-foreground">08/01/2025</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="templates">
                <Card className="p-4">
                  <QuickTemplateSelection
                    activeSection={activeSection}
                    onTemplateSelect={handleTemplateSelect}
                  />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
