import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

const REPORTS_DIR = path.join(process.cwd(), 'data', 'reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    const { sections, studyId } = await request.json();

    if (!sections || !studyId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const reportPath = path.join(REPORTS_DIR, `${studyId}.json`);
    
    // Save report data
    fs.writeFileSync(reportPath, JSON.stringify({
      sections,
      lastModified: new Date().toISOString(),
      studyId
    }, null, 2));

    return NextResponse.json({ 
      success: true,
      message: "Report saved successfully" 
    });
  } catch (error) {
    console.error("Save report error:", error);
    return NextResponse.json(
      { error: "Failed to save report" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const studyId = request.nextUrl.searchParams.get('studyId');

    if (!studyId) {
      return NextResponse.json(
        { error: "Study ID is required" },
        { status: 400 }
      );
    }

    const reportPath = path.join(REPORTS_DIR, `${studyId}.json`);
    
    if (!fs.existsSync(reportPath)) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    return NextResponse.json(reportData);
  } catch (error) {
    console.error("Load report error:", error);
    return NextResponse.json(
      { error: "Failed to load report" },
      { status: 500 }
    );
  }
}
