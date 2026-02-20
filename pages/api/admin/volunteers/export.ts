import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { format = 'pdf' } = req.query;

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Database connection not available' });
    }

    // Fetch all volunteers
    const { data: volunteers, error } = await supabaseAdmin
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (format === 'pdf') {
      // Generate HTML for PDF
      const html = generateVolunteersHTML(volunteers || []);

      // For now, return HTML that can be printed as PDF using browser print
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
    } else {
      return res.status(400).json({ error: 'Unsupported format' });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
}

function generateVolunteersHTML(volunteers: any[]): string {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Volunteers Report - Saintlammy Foundation</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }

    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      margin: 0;
      padding: 20px;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #0ea5e9;
    }

    .logo {
      width: 80px;
      height: 80px;
      margin: 0 auto 15px;
      background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 32px;
      font-weight: bold;
    }

    .header h1 {
      margin: 0;
      color: #0ea5e9;
      font-size: 28px;
    }

    .header p {
      margin: 5px 0 0;
      color: #64748b;
      font-size: 14px;
    }

    .meta-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      padding: 15px;
      background: #f1f5f9;
      border-radius: 8px;
    }

    .meta-info div {
      font-size: 14px;
    }

    .meta-info strong {
      color: #0ea5e9;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      border: 1px solid #cbd5e1;
    }

    .stat-card .number {
      font-size: 24px;
      font-weight: bold;
      color: #0ea5e9;
      margin-bottom: 5px;
    }

    .stat-card .label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      font-size: 12px;
    }

    thead {
      background: #0ea5e9;
      color: white;
    }

    th {
      padding: 12px 8px;
      text-align: left;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    td {
      padding: 10px 8px;
      border-bottom: 1px solid #e2e8f0;
    }

    tbody tr:nth-child(even) {
      background-color: #f8fafc;
    }

    tbody tr:hover {
      background-color: #e0f2fe;
    }

    .status {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status.pending {
      background-color: #fef3c7;
      color: #92400e;
    }

    .status.approved {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .status.active {
      background-color: #d1fae5;
      color: #065f46;
    }

    .status.inactive {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .interests {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .interest-tag {
      background: #e0f2fe;
      color: #0369a1;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 500;
    }

    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      text-align: center;
      font-size: 11px;
      color: #64748b;
    }

    .footer strong {
      color: #0ea5e9;
    }

    @media print {
      body {
        padding: 0;
      }

      .stats {
        page-break-inside: avoid;
      }

      table {
        page-break-inside: auto;
      }

      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }

      thead {
        display: table-header-group;
      }

      .footer {
        page-break-before: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">SF</div>
    <h1>Saintlammy Foundation</h1>
    <p>Volunteers Management Report</p>
  </div>

  <div class="meta-info">
    <div><strong>Report Generated:</strong> ${currentDate}</div>
    <div><strong>Total Volunteers:</strong> ${volunteers.length}</div>
    <div><strong>Document Type:</strong> Volunteer Registry</div>
  </div>

  <div class="stats">
    <div class="stat-card">
      <div class="number">${volunteers.length}</div>
      <div class="label">Total</div>
    </div>
    <div class="stat-card">
      <div class="number">${volunteers.filter(v => v.status === 'active').length}</div>
      <div class="label">Active</div>
    </div>
    <div class="stat-card">
      <div class="number">${volunteers.filter(v => v.status === 'pending').length}</div>
      <div class="label">Pending</div>
    </div>
    <div class="stat-card">
      <div class="number">${volunteers.filter(v => v.status === 'approved').length}</div>
      <div class="label">Approved</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Contact</th>
        <th>Location</th>
        <th>Interests</th>
        <th>Availability</th>
        <th>Status</th>
        <th>Applied</th>
      </tr>
    </thead>
    <tbody>
      ${volunteers.map(v => `
        <tr>
          <td><strong>${v.first_name} ${v.last_name}</strong></td>
          <td>
            ${v.email}<br>
            <small style="color: #64748b;">${v.phone}</small>
          </td>
          <td>${v.location || '—'}</td>
          <td>
            <div class="interests">
              ${(v.interests || []).slice(0, 3).map((int: string) =>
                `<span class="interest-tag">${int}</span>`
              ).join('')}
              ${(v.interests || []).length > 3 ? `<span class="interest-tag">+${(v.interests || []).length - 3}</span>` : ''}
            </div>
          </td>
          <td style="text-transform: capitalize;">${v.availability || '—'}</td>
          <td><span class="status ${v.status}">${v.status}</span></td>
          <td>${new Date(v.created_at).toLocaleDateString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>
      <strong>Saintlammy Foundation</strong><br>
      Empowering Communities · Transforming Lives<br>
      Email: info@saintlammyfoundation.org | Phone: +234 XXX XXX XXXX<br>
      <em>This is a confidential document. Please handle with care.</em>
    </p>
  </div>

  <script>
    // Auto-print when PDF export is requested
    window.onload = function() {
      setTimeout(() => {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
`;
}
