import Papa from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnalysisResult } from '../types';

/**
 * Downloads a text file with specified MIME type
 */
function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export analyzed results as standard CSV
 */
export function exportAnalyzedCsv(result: AnalysisResult) {
  const rows = result.records.map((r, i) => ({
    Index: i + 1,
    Original_Comment: r.originalText,
    Sentiment: r.sentiment,
    Confidence_Score: `${Math.round(r.confidence * 100)}%`,
    Polarity_Index: r.polarityScore,
    Category: r.category || 'General Feedback',
    Stakeholder_Type: r.stakeholderType || 'Citizen',
    Extracted_Keywords: r.keywords.join('; ')
  }));

  const csv = Papa.unparse(rows);
  const cleanName = result.fileName.replace(/\.[^/.]+$/, '');
  const timestamp = new Date().toISOString().slice(0, 10);
  triggerDownload(csv, `Analyzed_Consultation_${cleanName}_${timestamp}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export full JSON payload for programmatic API integrations
 */
export function exportJsonAnalysis(result: AnalysisResult) {
  const payload = {
    metadata: {
      tool: 'SIH-2025 E-Consultation Feedback Analyzer',
      problemStatement: 'PS-25035',
      fileName: result.fileName,
      analyzedAt: result.analyzedAt,
      stats: result.stats
    },
    executiveSummary: result.summary,
    topKeywords: result.keywords,
    thematicClusters: result.themes,
    records: result.records
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const cleanName = result.fileName.replace(/\.[^/.]+$/, '');
  triggerDownload(jsonStr, `E_Consultation_Analysis_${cleanName}.json`, 'application/json;charset=utf-8;');
}

/**
 * Export formal Government Executive PDF Briefing
 */
export function exportExecutivePdfReport(result: AnalysisResult) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor: [number, number, number] = [36, 59, 42]; // #243B2A Deep Forest
  const accentColor: [number, number, number] = [184, 107, 75]; // #B86B4B Terracotta

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT E-CONSULTATION FEEDBACK ANALYSIS', 14, 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`SIH 2025 PS-25035 | Source: ${result.fileName} | Generated: ${new Date().toLocaleDateString()}`, 14, 22);

  // Key Statistics Strip
  doc.setFillColor(243, 239, 230); // Warm Beige
  doc.rect(14, 38, 182, 22, 'F');

  doc.setTextColor(59, 48, 40); // Dark Brown
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Comments: ${result.stats.totalComments}`, 20, 48);
  doc.text(`Favorable: ${result.stats.positivePercentage}%`, 68, 48);
  doc.text(`Neutral: ${result.stats.neutralPercentage}%`, 112, 48);
  doc.text(`Critical: ${result.stats.negativePercentage}%`, 155, 48);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(102, 115, 90); // Olive
  doc.text(`Public Stance Score: ${result.summary.overallStance}`, 20, 55);
  doc.text(`Avg Model Confidence: ${Math.round(result.stats.averageConfidence * 100)}%`, 112, 55);

  let currentY = 68;

  // Executive Brief
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Executive Briefing for Review Committee', 14, currentY);
  currentY += 6;

  doc.setTextColor(59, 48, 40);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  const splitBrief = doc.splitTextToSize(result.summary.executiveBrief, 182);
  doc.text(splitBrief, 14, currentY);
  currentY += splitBrief.length * 4.8 + 6;

  // Key Positive Highlights
  doc.setTextColor(52, 94, 61); // Forest Green
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Major Positive Highlights', 14, currentY);
  currentY += 5;

  doc.setTextColor(59, 48, 40);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  result.summary.majorPositiveHighlights.slice(0, 3).forEach((item) => {
    const bullet = doc.splitTextToSize(`• ${item}`, 178);
    doc.text(bullet, 18, currentY);
    currentY += bullet.length * 4.2;
  });
  currentY += 4;

  // Key Concerns
  doc.setTextColor(184, 107, 75); // Terracotta
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('3. Key Stakeholder Concerns & Friction Points', 14, currentY);
  currentY += 5;

  doc.setTextColor(59, 48, 40);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  result.summary.majorConcerns.slice(0, 3).forEach((item) => {
    const bullet = doc.splitTextToSize(`• ${item}`, 178);
    doc.text(bullet, 18, currentY);
    currentY += bullet.length * 4.2;
  });
  currentY += 4;

  // Actionable Policy Recommendations
  doc.setTextColor(...accentColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('4. Actionable Policy Recommendations', 14, currentY);
  currentY += 5;

  doc.setTextColor(59, 48, 40);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  result.summary.actionableRecommendations.slice(0, 3).forEach((item) => {
    const bullet = doc.splitTextToSize(`• ${item}`, 178);
    doc.text(bullet, 18, currentY);
    currentY += bullet.length * 4.2;
  });
  currentY += 8;

  // Representative Comments Table
  doc.setTextColor(...primaryColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('5. Representative Stakeholder Submissions Sample', 14, currentY);
  currentY += 4;

  const tableRows = result.records.slice(0, 6).map((r) => [
    r.sentiment,
    `${Math.round(r.confidence * 100)}%`,
    r.originalText.length > 95 ? `${r.originalText.slice(0, 92)}...` : r.originalText,
    r.keywords.slice(0, 3).join(', ')
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Sentiment', 'Confidence', 'Comment Text', 'Keywords']],
    body: tableRows,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: primaryColor, textColor: 255 },
    columnStyles: {
      0: { cellWidth: 24, fontStyle: 'bold' },
      1: { cellWidth: 22 },
      2: { cellWidth: 96 },
      3: { cellWidth: 40 }
    }
  });

  const cleanName = result.fileName.replace(/\.[^/.]+$/, '');
  doc.save(`Executive_Brief_${cleanName}.pdf`);
}
