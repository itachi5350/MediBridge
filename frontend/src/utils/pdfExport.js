import { jsPDF } from "jspdf";

export function exportToPDF(result, input, language) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // Header background
  doc.setFillColor(20, 184, 166);
  doc.rect(0, 0, pageWidth, 45, "F");

  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("MEDIBRIDGE", margin, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 245, 240);
  doc.text("Health Guidance Report", margin, 32);

  // Date top right
  doc.setFontSize(9);
  const date = new Date().toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric"
  });
  const time = new Date().toLocaleTimeString("en-IN");
  doc.text("Generated: " + date + " at " + time, pageWidth - margin, 22, { align: "right" });
  doc.text("Language preference: " + language.charAt(0).toUpperCase() + language.slice(1), pageWidth - margin, 32, { align: "right" });

  y = 60;

  // Urgency badge
  const urgencyColors = {
    low: [22, 163, 74],
    moderate: [202, 138, 4],
    high: [220, 38, 38],
  };
  const urgencyLabels = {
    low: "LOW URGENCY — Home care should be sufficient",
    moderate: "MODERATE URGENCY — See a doctor soon",
    high: "HIGH URGENCY — Seek help today",
  };
  const color = urgencyColors[result.urgency_level] || urgencyColors.moderate;
  doc.setFillColor(...color);
  doc.roundedRect(margin, y, contentWidth, 16, 3, 3, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(
    urgencyLabels[result.urgency_level] || "MODERATE URGENCY",
    pageWidth / 2, y + 10,
    { align: "center" }
  );

  y += 26;

  // Section helper
  function addSection(title, body) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(107, 114, 128);
    doc.text(title.toUpperCase(), margin, y);
    y += 5;

    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(31, 41, 55);
    const lines = doc.splitTextToSize(body, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 6 + 10;
  }

  addSection("Symptoms Described", input);
  addSection("What We Understood", result.understood_symptom);
  addSection("What This Could Mean", result.plain_explanation);
  addSection("Urgency Reason", result.urgency_reason);
  addSection("Recommended Action", result.recommended_action);

  // Note about regional language
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(20, 184, 166);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 20, 3, 3, "FD");
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(15, 118, 110);
  doc.text(
    "A response in your preferred language (" + language + ") was provided in the app.",
    pageWidth / 2, y + 8,
    { align: "center" }
  );
  doc.text(
    "PDF export supports English only due to font limitations.",
    pageWidth / 2, y + 15,
    { align: "center" }
  );
  y += 30;

  // Disclaimer
  doc.setFillColor(249, 250, 251);
  doc.rect(0, y, pageWidth, 30, "F");
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(156, 163, 175);
  const disclaimer = doc.splitTextToSize(result.disclaimer, contentWidth);
  doc.text(disclaimer, pageWidth / 2, y + 10, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.text("MediBridge — Health guidance in your language", pageWidth / 2, y + 22, { align: "center" });

  const filename = "MediBridge_Report_" + new Date().toISOString().slice(0, 10) + ".pdf";
  doc.save(filename);
}