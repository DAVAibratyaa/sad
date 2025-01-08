"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { FileText } from "lucide-react";
import { Section, SimpleTemplate } from "../lib/types";

interface QuickTemplateSelectionProps {
  activeSection: Section;
  onTemplateSelect: (template: SimpleTemplate) => void;
}

const TEMPLATES = [
  {
    category: "CT Abdomen",
    description: "Body CT Abdomen and Pelvis with Cont...",
    templates: [
      { content: "Normal CT of the abdomen and pelvis without acute abnormality. The liver, spleen, pancreas, and adrenal glands are normal in appearance. No lymphadenopathy or free fluid." },
      { content: "No acute intra-abdominal process. Normal bowel gas pattern. No evidence of bowel obstruction or inflammatory changes." }
    ]
  },
  {
    category: "Bone",
    description: "",
    templates: [
      { content: "Normal bone mineralization. No acute fracture or dislocation. No suspicious osseous lesions." },
      { content: "Degenerative changes noted as described above. No acute osseous abnormality." }
    ]
  },
  {
    category: "Chest Portable",
    description: "Chest XR 1 View",
    templates: [
      { content: "The lungs are clear bilaterally. No focal consolidation, pleural effusion, or pneumothorax. The cardiomediastinal silhouette is normal." },
      { content: "No acute cardiopulmonary process. The heart size is normal. No pulmonary edema." }
    ]
  },
  {
    category: "Chest Double",
    description: "Chest XR 2 View",
    templates: [
      { content: "PA and lateral views of the chest demonstrate clear lungs without focal consolidation, pleural effusion, or pneumothorax. The cardiomediastinal silhouette is normal." },
      { content: "Two-view chest radiograph shows no acute cardiopulmonary abnormality. The heart size and pulmonary vascularity are within normal limits." }
    ]
  },
  {
    category: "Coronary Score",
    description: "CT CT Calcium Score",
    templates: [
      { content: "Coronary calcium scoring was performed with the following results:\nLAD: [score]\nLCX: [score]\nRCA: [score]\nTotal Agatston score: [total]" },
      { content: "Minimal coronary calcification present. Total Agatston score is [score], placing the patient in the [percentile] percentile for age and gender." }
    ]
  },
  {
    category: "MSK MRI Knee",
    description: "MSK MRI Knee without Contrast",
    templates: [
      { content: "MRI of the knee demonstrates intact cruciate and collateral ligaments. The menisci are normal. No bone marrow edema or joint effusion." },
      { content: "No internal derangement. Normal appearance of the menisci, cruciate and collateral ligaments. No significant joint effusion." }
    ]
  },
  {
    category: "US Thyroid TI-RADS",
    description: "",
    templates: [
      { content: "Thyroid ultrasound demonstrates normal thyroid size and echogenicity. No suspicious nodules identified. No cervical lymphadenopathy." },
      { content: "Thyroid is normal in size. Multiple subcentimeter nodules present, all with benign features (TI-RADS 2)." }
    ]
  }
];

export function QuickTemplateSelection({ activeSection, onTemplateSelect }: QuickTemplateSelectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTemplates = TEMPLATES.filter(template => 
    template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTemplateClick = (template: SimpleTemplate) => {
    onTemplateSelect(template);
  };

  return (
    <div className="space-y-2">
      {filteredTemplates.map((category, index) => (
        <div key={index} className="space-y-2">
          <div 
            className="template-category cursor-pointer"
            onClick={() => setSelectedCategory(selectedCategory === category.category ? null : category.category)}
          >
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm">{category.category}</span>
              {category.description && (
                <span className="text-xs text-muted-foreground">({category.description})</span>
              )}
            </div>
          </div>

          {selectedCategory === category.category && (
            <div className="pl-6 space-y-2">
              {category.templates.map((template, tIndex) => (
                <div
                  key={tIndex}
                  className="text-sm text-muted-foreground hover:text-foreground cursor-pointer p-2 rounded hover:bg-hover-bg transition-colors"
                  onClick={() => handleTemplateClick(template)}
                >
                  {template.content.slice(0, 50)}...
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
