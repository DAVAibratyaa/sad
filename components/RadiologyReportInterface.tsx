"use client";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import { VoiceRecorder } from "./VoiceRecorder";
import { QuickTemplateSelection } from "./QuickTemplateSelection";
import { Template, SimpleTemplate } from "../lib/types";
import { useState, useCallback, useEffect } from "react";
import { cn } from "../lib/utils";
import {
  Bold,
  Italic,
  List,
  AlignLeft,
  Undo2,
  Redo2,
  Copy,
  Trash2,
  Plus,
  ChevronRight,
  FileText,
  Mic,
  Search
} from "lucide-react";
import { Section, SectionContent, ReportSections, SECTIONS } from "../lib/types";

export function RadiologyReportInterface() {
  const [activeSection, setActiveSection] = useState<Section>("Lungs");
  const [sections, setSections] = useState<ReportSections>(
    Object.fromEntries(
      SECTIONS.map(section => [
        section,
        { content: "", lastModified: new Date() }
      ])
    ) as ReportSections
  );

  const [exam, setExam] = useState({
    name: "XR Chest 2 Views",
    id: "RAD0111",
    bpid: "BPID2503",
    status: "Available"
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleTranscriptionComplete = useCallback(async (text: string, section: Section) => {
    // First update the section with the transcribed text
    setSections(prev => {
      const newContent = prev[section].content + (prev[section].content ? "\n" : "") + text;
      return {
        ...prev,
        [section]: {
          content: newContent,
          lastModified: new Date(),
          isEnhancing: true
        }
      };
    });

    // Set the active section to the AI-classified section
    setActiveSection(section);

    // Then enhance the text
    try {
      const response = await fetch("/api/enhance-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, section }),
      });

      if (!response.ok) {
        throw new Error("Enhancement failed");
      }

      const data = await response.json();
      setSections(prev => ({
        ...prev,
        [section]: {
          content: data.text,
          lastModified: new Date(),
          isEnhancing: false,
        }
      }));
    } catch (error) {
      console.error("Text enhancement error:", error);
      setSections(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          isEnhancing: false,
        }
      }));
    }
  }, []);

  const handleTemplateSelect = useCallback((template: SimpleTemplate) => {
    setSections(prev => ({
      ...prev,
      [activeSection]: {
        content: prev[activeSection].content + (prev[activeSection].content ? "\n" : "") + template.content,
        lastModified: new Date()
      }
    }));
  }, [activeSection]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(sections[activeSection].content);
  }, [sections, activeSection]);

  const handleUndo = useCallback(() => {
    document.execCommand('undo');
  }, []);

  const handleRedo = useCallback(() => {
    document.execCommand('redo');
  }, []);

  return (
    <div className="flex h-screen bg-sidebar-bg text-foreground">
      {/* Left Sidebar - Fields */}
      <div className="w-48 border-r border-border-color">
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm font-medium">FIELDS</span>
          <span className="text-sm">AZ</span>
        </div>
        <div className="space-y-0.5">
          {SECTIONS.map((section) => (
            <button
              key={section}
              className={cn(
                "section-button",
                activeSection === section && "active"
              )}
              onClick={() => setActiveSection(section)}
            >
              {section}
              {sections[section].isEnhancing && (
                <span className="ml-2 animate-spin">⌛</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#0d1117]">
        {/* Top Bar */}
        <div className="h-12 border-b border-border-color flex items-center px-4 space-x-4">
          <span className="text-sm font-medium">EXAM:</span>
          <span className="text-sm text-muted-foreground">{exam.name}</span>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4">
          <ScrollArea className="h-[calc(100vh-8rem)] rounded-md border p-4">
            <textarea
              className="min-h-[calc(100vh-10rem)] w-full resize-none bg-transparent p-2 focus:outline-none"
              placeholder="Start speaking or use templates..."
              value={sections[activeSection].content}
              onChange={(e) => setSections(prev => ({
                ...prev,
                [activeSection]: {
                  content: e.target.value,
                  lastModified: new Date()
                }
              }))}
            />
          </ScrollArea>
        </div>

        {/* Toolbar */}
        <div className="h-12 border-t border-border-color flex items-center px-4 justify-between bg-sidebar-bg">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="toolbar-button">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="toolbar-button">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="toolbar-button">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="toolbar-button">
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="toolbar-button" onClick={handleUndo}>
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="toolbar-button" onClick={handleRedo}>
              <Redo2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="toolbar-button" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
            <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">IMPRESSION</Button>
            <Button variant="ghost" size="sm">REPORT</Button>
            <Button variant="ghost" size="sm">UNCHANGED</Button>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Study & Templates */}
      <div className="w-80 border-l border-border-color">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">STUDY</span>
            <Button variant="ghost" size="icon" className="toolbar-button">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4">
            <h2 className="text-sm font-medium">{exam.name} ({exam.id})</h2>
            <p className="text-sm text-muted-foreground">{exam.bpid}</p>
            <p className="text-sm text-muted-foreground">{exam.status}</p>
          </div>
          <div className="mt-4">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Associated Exams
            </Button>
          </div>
        </div>

        {/* OMNI Section */}
        <div className="omni-section mx-4">
          <div className="relative">
            <Input 
              className="template-search pl-10"
              placeholder="Say 'Omni bot' to get started..."
            />
            <Mic className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Templates Section */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">TEMPLATES</span>
            <div className="relative">
              <Input 
                className="template-search w-48 pl-10"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="mt-4">
            <QuickTemplateSelection
              activeSection={activeSection}
              onTemplateSelect={handleTemplateSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
