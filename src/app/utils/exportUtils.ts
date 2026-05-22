import type { Lead } from '../mockData';
import type { Invoice } from '../mockInvoices';

// ─── CSV Export ──────────────────────────────────────────────────────────────

export function exportLeadsToCSV(leads: Lead[], filename?: string) {
  const headers = [
    'First Name', 'Last Name', 'Title', 'Company', 'Industry',
    'Email', 'Phone', 'Country', 'Employee Size', 'Revenue',
    'Lead Score', 'Status', 'Campaign', 'Delivery Date', 'Rejection Reason',
  ];

  const rows = leads.map(lead => [
    lead.firstName,
    lead.lastName,
    lead.title,
    lead.company,
    lead.industry,
    lead.email,
    lead.phone,
    lead.country,
    lead.employeeSize,
    lead.revenue,
    String(lead.leadScore),
    lead.status,
    lead.campaignName,
    lead.deliveryDate,
    lead.rejectionReason || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  downloadFile(csvContent, filename || `leads_export_${formatDateForFile()}.csv`, 'text/csv');
}

export function exportInvoicesToCSV(invoices: Invoice[]) {
  const headers = ['Invoice Number', 'Campaign', 'Issue Date', 'Due Date', 'Amount', 'Status'];

  const rows = invoices.map(inv => [
    inv.invoiceNumber,
    inv.campaignName,
    inv.issueDate,
    inv.dueDate,
    String(inv.amount),
    inv.status,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  downloadFile(csvContent, `invoices_export_${formatDateForFile()}.csv`, 'text/csv');
}

// ─── Invoice PDF Generation ──────────────────────────────────────────────────

export async function generateInvoicePDF(invoice: Invoice) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const brandColor: [number, number, number] = [186, 32, 39]; // #BA2027
  const gray: [number, number, number] = [107, 114, 128];
  const dark: [number, number, number] = [17, 24, 39];

  // Header bar
  doc.setFillColor(...brandColor);
  doc.rect(0, 0, 210, 35, 'F');

  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Datamatics', 15, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Business Solutions', 15, 25);

  // Invoice label
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 195, 22, { align: 'right' });

  // Invoice details section
  let y = 50;
  doc.setTextColor(...dark);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Invoice Number:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoiceNumber, 60, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Issue Date:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDateForDisplay(invoice.issueDate), 60, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Due Date:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDateForDisplay(invoice.dueDate), 60, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Status:', 15, y);
  doc.setFont('helvetica', 'normal');
  const statusColor = invoice.status === 'Paid' ? [34, 197, 94] as [number, number, number]
    : invoice.status === 'Overdue' ? brandColor : [234, 179, 8] as [number, number, number];
  doc.setTextColor(...statusColor);
  doc.text(invoice.status.toUpperCase(), 60, y);
  doc.setTextColor(...dark);

  // Bill To
  y += 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Bill To:', 15, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  // Resolve client company name dynamically to avoid hardcoding
  const { allClients } = await import('../data/mockClients');
  const client = allClients.find(c => c.campaigns.some(camp => camp.name === invoice.campaignName));
  const clientName = client ? client.companyName : 'Intentsify';
  
  doc.text(clientName, 15, y);
  y += 5;
  doc.setTextColor(...gray);
  doc.text('TJ Leyland, VP of Sales', 15, y);
  doc.setTextColor(...dark);

  // From
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('From:', 120, y - 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Datamatics Business Solutions Ltd', 120, y - 5);
  doc.setTextColor(...gray);
  doc.text('Mumbai, India', 120, y);
  doc.setTextColor(...dark);

  // Divider
  y += 12;
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(15, y, 195, y);

  // Line items table header
  y += 10;
  doc.setFillColor(249, 250, 251);
  doc.rect(15, y - 5, 180, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...gray);
  doc.text('DESCRIPTION', 18, y + 1);
  doc.text('QTY', 120, y + 1);
  doc.text('RATE', 145, y + 1);
  doc.text('AMOUNT', 192, y + 1, { align: 'right' });

  // Line item
  y += 12;
  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(invoice.campaignName, 18, y);
  doc.text('1', 123, y);
  doc.text(`$${invoice.amount.toLocaleString()}`, 145, y);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${invoice.amount.toLocaleString()}`, 192, y, { align: 'right' });

  // Totals
  y += 20;
  doc.setDrawColor(229, 231, 235);
  doc.line(130, y, 195, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...gray);
  doc.text('Subtotal:', 130, y);
  doc.setTextColor(...dark);
  doc.text(`$${invoice.amount.toLocaleString()}`, 192, y, { align: 'right' });

  y += 7;
  doc.setTextColor(...gray);
  doc.text('Tax (0%):', 130, y);
  doc.setTextColor(...dark);
  doc.text('$0', 192, y, { align: 'right' });

  y += 10;
  doc.setDrawColor(...brandColor);
  doc.setLineWidth(1);
  doc.line(130, y, 195, y);
  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Total Due:', 130, y);
  doc.setTextColor(...brandColor);
  doc.text(`$${invoice.amount.toLocaleString()}`, 192, y, { align: 'right' });

  // Footer
  doc.setTextColor(...gray);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your business.', 105, 270, { align: 'center' });
  doc.text('Datamatics Business Solutions Limited © 2026', 105, 275, { align: 'center' });
  doc.text('ISO 27001:2022 • ISO 9001:2015 • SOC 1 & 2 TYPE II • GDPR', 105, 280, { align: 'center' });

  doc.save(`${invoice.invoiceNumber}.pdf`);
}

// ─── Weekly Performance Digest PDF Generation ────────────────────────────────

export async function generateWeeklyDigestPDF(
  clientName: string,
  metrics: { leadsDelivered: number; acceptanceRate: number; pipelineValue: number },
  campaigns: any[]
) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  const brandColor: [number, number, number] = [186, 32, 39]; // #BA2027
  const gray: [number, number, number] = [107, 114, 128];
  const dark: [number, number, number] = [17, 24, 39];
  const lightBg: [number, number, number] = [249, 250, 251];

  // Header bar styled in brand red (#BA2027)
  doc.setFillColor(...brandColor);
  doc.rect(0, 0, 210, 35, 'F');

  // Glowing brand mark + title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Pulse', 15, 18);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('BY DATAMATICS', 15, 25);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('WEEKLY PERFORMANCE DIGEST', 195, 22, { align: 'right' });

  // Client Details & Period Info
  let y = 50;
  doc.setTextColor(...dark);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Client Profile:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(clientName, 45, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Report Period:', 115, y);
  doc.setFont('helvetica', 'normal');
  const monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  doc.text(`${monthYear} (Weekly Summary)`, 145, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Generated On:', 15, y);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 45, y);

  y += 12;
  // Divider line
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(15, y, 195, y);

  // Section 1: KPI Summary Metrics
  y += 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Campaign Health & KPI Summary', 15, y);

  y += 6;
  const kpis = [
    { label: 'Leads Delivered', value: String(metrics.leadsDelivered) },
    { label: 'Acceptance Rate', value: `${metrics.acceptanceRate}%` },
    { label: 'Pipeline Value', value: `$${metrics.pipelineValue.toLocaleString()}` },
  ];

  // Draw 3 cards for metrics side-by-side
  const cardWidth = 56;
  const cardHeight = 22;
  const gap = 6;
  kpis.forEach((kpi, index) => {
    const cardX = 15 + index * (cardWidth + gap);
    // Draw background rect with light red tint
    doc.setFillColor(250, 245, 245);
    doc.setDrawColor(245, 225, 225);
    doc.roundedRect(cardX, y, cardWidth, cardHeight, 3, 3, 'FD');

    // Value
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(...brandColor);
    doc.text(kpi.value, cardX + cardWidth / 2, y + 9, { align: 'center' });

    // Label
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...gray);
    doc.text(kpi.label, cardX + cardWidth / 2, y + 16, { align: 'center' });
  });

  y += cardHeight + 12;

  // Section 2: Leads by Day Flow
  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Daily Lead Delivery Breakdown', 15, y);

  y += 8;
  // Simple Horizontal Daily Breakdown Grid
  const days = [
    { name: 'Monday', leads: 152 },
    { name: 'Tuesday', leads: 214 },
    { name: 'Wednesday', leads: 251 },
    { name: 'Thursday', leads: 176 },
    { name: 'Friday', leads: 54 },
  ];
  const barMaxVal = 251;
  const barMaxWidth = 110;
  
  days.forEach((day) => {
    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...dark);
    doc.text(day.name, 15, y + 5);

    // Bar background
    doc.setFillColor(243, 244, 246);
    doc.rect(45, y + 1.5, barMaxWidth, 4, 'F');

    // Bar fill in brand red
    const fillWidth = (day.leads / barMaxVal) * barMaxWidth;
    doc.setFillColor(...brandColor);
    doc.rect(45, y + 1.5, fillWidth, 4, 'F');

    // Lead count
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...brandColor);
    doc.text(String(day.leads), 165, y + 5);
    
    y += 8;
  });

  y += 10;
  // Section 3: Active Campaigns Table
  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Active Campaigns Detail', 15, y);

  y += 6;
  // Table Header
  doc.setFillColor(...lightBg);
  doc.rect(15, y, 180, 8, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.line(15, y, 195, y);
  doc.line(15, y + 8, 195, y + 8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...gray);
  doc.text('CAMPAIGN NAME', 18, y + 5.5);
  doc.text('TARGET', 105, y + 5.5);
  doc.text('DELIVERED', 130, y + 5.5);
  doc.text('PACING %', 155, y + 5.5);
  doc.text('STATUS', 178, y + 5.5);

  y += 8;
  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'normal');
  
  const activeCampaigns = campaigns.filter(c => c.status === 'active' || c.status === 'Live');
  if (activeCampaigns.length === 0) {
    doc.text('No active campaigns found this week.', 18, y + 6);
    y += 10;
  } else {
    activeCampaigns.forEach((camp) => {
      // Row height
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      // Clean name truncate if too long
      const name = camp.name.length > 40 ? camp.name.slice(0, 38) + '...' : camp.name;
      doc.text(name, 18, y + 6);
      
      doc.setFont('helvetica', 'normal');
      doc.text(String(camp.target || camp.goalLeads || 0), 105, y + 6);
      doc.text(String(camp.delivered || camp.deliveredLeads || 0), 130, y + 6);

      const pacing = camp.target ? Math.round(((camp.delivered || 0) / camp.target) * 100) : 0;
      doc.text(`${pacing}%`, 155, y + 6);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129); // emerald
      doc.text('ACTIVE', 178, y + 6);
      
      doc.setTextColor(...dark);
      doc.setFont('helvetica', 'normal');
      
      // Border bottom
      doc.setDrawColor(243, 244, 246);
      doc.line(15, y + 9, 195, y + 9);
      y += 9;
    });
  }

  y += 7;
  // Rejection reasons & insights
  doc.setTextColor(...dark);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Weekly Quality & Lead Exceptions', 15, y);

  y += 5;
  // Rejection analysis content
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(252, 165, 165);
  doc.roundedRect(15, y, 180, 20, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...brandColor);
  doc.text('Operations Feedback & Overrides', 20, y + 5);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(127, 29, 29);
  doc.text('Total rejected leads this week: 54 leads. Primary rejection reasons include:', 20, y + 10);
  doc.text('• Company Size Mismatch: 42% (23 leads)   • Invalid Email / Bounce: 34% (18 leads)   • Seniority Discrepancy: 24% (13 leads)', 20, y + 15);

  // Footer certifications & contact
  doc.setTextColor(...gray);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for choosing Pulse by Datamatics.', 105, 270, { align: 'center' });
  doc.text('Datamatics Business Solutions Limited © 2026', 105, 275, { align: 'center' });
  doc.text('ISO 27001:2022 • ISO 9001:2015 • SOC 1 & 2 TYPE II • GDPR', 105, 280, { align: 'center' });

  doc.save(`Weekly_Digest_${clientName.replace(/\s+/g, '_')}_${monthYear.replace(/\s+/g, '_')}.pdf`);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatDateForFile() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function formatDateForDisplay(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
