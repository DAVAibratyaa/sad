"use client";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { VoiceRecorder } from "./VoiceRecorder";
import { QuickTemplateSelection } from "./QuickTemplateSelection";
import { Template } from "../lib/defaultTemplates";
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
  Snowflake,
  Search
} from "lucide-react";

interface SectionContent {
  content: string;
  lastModified: Date;
  isEnhancing?: boolean;
}

type ReportSections = {
  [key: string]: SectionContent;
};

const SECTIONS = [
  "Procedure",
  "History",
  "Technique",
  "Comparison",
  "Lungs",
  "Pleura",
  "Cardiomediastinal",
  "Bones",
  "Impression"
] as const;

type Section = typeof SECTIONS[number];

const TEMPLATES = [
  { icon: FileText, label: "CT Abdomen", description: "Body CT Abdomen and Pelvis with Cont..." },
  { icon: FileText, label: "Bone", description: "" },
  { icon: FileText, label: "Chest Portable", description: "Chest XR 1 View" },
  { icon: FileText, label: "Chest Double", description: "Chest XR 2 View" },
  { icon: FileText, label: "Coronary Score", description: "CT CT Calcium Score" },
  { icon: FileText, label: "MSK MRI Knee", description: "MSK MRI Knee without Contrast" },
  { icon: FileText, label: "US Thyroid TI-RADS", description: "" },
];

export function RadiologyReportInterface() {
  const [activeSection, setActiveSection] = useState<Section>("Lungs");
  const [sections, setSections] = useState<ReportSections>(
    Object.fromEntries(
      SECTIONS.map(section => [
        section,
        { content: "", lastModified: new Date() }
      ])
    )
  );

  const [exam, setExam] = useState({
    name: "XR Chest 2 Views",
    id: "RAD0111",
    bpid: "BPID2503",
    status: "Available"
  });

  const [searchQuery, setSearchQuery] = useState("");

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
          {/* Section Headers */}
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium">HISTORY:</span>
              <p className="text-sm text-muted-foreground">RML pneumonia</p>
            </div>
            <div>
              <span className="text-sm font-medium">TECHNIQUE:</span>
              <p className="text-sm text-muted-foreground">PA and lateral views of the chest</p>
            </div>
            <div>
              <span className="text-sm font-medium">COMPARISON:</span>
              <p className="text-sm text-muted-foreground">None</p>
            </div>
            <div>
              <span className="text-sm font-medium">FINDINGS:</span>
              <div className="pl-4 border-l-2 border-active-blue space-y-2">
                <p className="text-sm">The lungs are clear. No pleural effusion or pneumothorax.</p>
                <p className="text-sm">The cardiomediastinal silhouette is within normal limits.</p>
                <p className="text-sm">No significant osseous abnormalities.</p>
              </div>
            </div>
            <div>
              <span className="text-sm font-medium">IMPRESSION:</span>
              <p className="text-sm text-muted-foreground">No active disease in the chest</p>
            </div>
          </div>
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
          <div className="mt-4 space-y-1">
            {TEMPLATES.map((template, index) => (
              <div key={index} className="template-category">
                <template.icon className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm">{template.label}</span>
                  {template.description && (
                    <span className="text-xs text-muted-foreground">({template.description})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
