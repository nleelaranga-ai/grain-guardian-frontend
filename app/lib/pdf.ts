import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportPDF(
  elementId: string
) {
  const element =
    document.getElementById(elementId);

  if (!element) return;

  const canvas =
    await html2canvas(element);

  const image =
    canvas.toDataURL("image/png");

  const pdf = new jsPDF(
    "p",
    "mm",
    "a4"
  );

  pdf.addImage(
    image,
    "PNG",
    0,
    0,
    210,
    297
  );

  pdf.save(
    "grainguardian-report.pdf"
  );
}
