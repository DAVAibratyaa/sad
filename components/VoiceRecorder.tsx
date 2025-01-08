"use client";

import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Mic } from "lucide-react";
import { Section } from "../lib/types";

interface VoiceRecorderProps {
  onTranscriptionComplete: (text: string, section: Section) => void;
}

export function VoiceRecorder({ onTranscriptionComplete }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);

        try {
          // First, get the transcription
          const transcribeResponse = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (!transcribeResponse.ok) {
            throw new Error('Transcription failed');
          }

          const transcribeData = await transcribeResponse.json();
          const text = transcribeData.text;

          // Then, classify the section
          const classifyResponse = await fetch('/api/classify-section', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
          });

          if (!classifyResponse.ok) {
            throw new Error('Section classification failed');
          }

          const classifyData = await classifyResponse.json();
          onTranscriptionComplete(text, classifyData.section as Section);
        } catch (error) {
          console.error('Processing error:', error);
        } finally {
          setIsProcessing(false);
        }

        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, [onTranscriptionComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  }, [mediaRecorder]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`toolbar-button ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
    >
      <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''} ${isProcessing ? 'animate-spin' : ''}`} />
    </Button>
  );
}
