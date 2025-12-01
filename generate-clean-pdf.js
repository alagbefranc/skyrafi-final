const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

function mdToHtml(md) {
    // Remove emojis
    md = md.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
    
    // Split into lines for processing
    const lines = md.split('\n');
    let html = [];
    let inList = null; // 'ul', 'ol', or null
    let inTable = false;
    let tableHeaders = [];
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        // Handle tables
        if (line.trim().startsWith('|')) {
            if (!inTable) {
                // Table header
                inTable = true;
                tableHeaders = line.split('|').map(h => h.trim()).filter(h => h);
                html.push('<table class="table">');
                html.push('<thead><tr>');
                tableHeaders.forEach(h => {
                    html.push(`<th>${h.replace(/\*\*/g, '')}</th>`);
                });
                html.push('</tr></thead><tbody>');
                i++; // Skip separator line
            } else {
                // Table row
                const cells = line.split('|').map(c => c.trim()).filter(c => c);
                if (cells.length > 0) {
                    html.push('<tr>');
                    cells.forEach(c => {
                        html.push(`<td>${c.replace(/\*\*/g, '<strong>').replace(/\*\*/g, '</strong>')}</td>`);
                    });
                    html.push('</tr>');
                }
            }
        } else if (inTable && line.trim() === '') {
            html.push('</tbody></table>');
            inTable = false;
        }
        // Handle headings
        else if (line.startsWith('#### ')) {
            if (inList) { html.push(inList === 'ul' ? '</ul>' : '</ol>'); inList = null; }
            html.push(`<h4>${line.replace('#### ', '')}</h4>`);
        } else if (line.startsWith('### ')) {
            if (inList) { html.push(inList === 'ul' ? '</ul>' : '</ol>'); inList = null; }
            html.push(`<h3>${line.replace('### ', '')}</h3>`);
        } else if (line.startsWith('## ')) {
            if (inList) { html.push(inList === 'ul' ? '</ul>' : '</ol>'); inList = null; }
            html.push(`<h2>${line.replace('## ', '')}</h2>`);
        } else if (line.startsWith('# ')) {
            if (inList) { html.push(inList === 'ul' ? '</ul>' : '</ol>'); inList = null; }
            html.push(`<h1>${line.replace('# ', '')}</h1>`);
        }
        // Handle horizontal rules
        else if (line.trim() === '---') {
            if (inList) { html.push(inList === 'ul' ? '</ul>' : '</ol>'); inList = null; }
            html.push('<hr>');
        }
        // Handle lists
        else if (line.match(/^- /)) {
            if (inList && inList !== 'ul') {
                html.push('</ol>');
                html.push('<ul>');
                inList = 'ul';
            } else if (!inList) {
                html.push('<ul>');
                inList = 'ul';
            }
            let content = line.replace(/^- /, '');
            content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            html.push(`<li>${content}</li>`);
        } else if (line.match(/^\d+\. /)) {
            if (inList && inList !== 'ol') {
                html.push('</ul>');
                html.push('<ol>');
                inList = 'ol';
            } else if (!inList) {
                html.push('<ol>');
                inList = 'ol';
            }
            let content = line.replace(/^\d+\. /, '');
            content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            html.push(`<li>${content}</li>`);
        }
        // Handle paragraphs
        else if (line.trim() !== '') {
            if (inList && !line.startsWith('  ')) {
                html.push(inList === 'ul' ? '</ul>' : '</ol>');
                inList = null;
            }
            let content = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
            html.push(`<p>${content}</p>`);
        } else if (line.trim() === '' && inList) {
            html.push(inList === 'ul' ? '</ul>' : '</ol>');
            inList = null;
        }
    }
    
    if (inList) html.push(inList === 'ul' ? '</ul>' : '</ol>');
    if (inTable) html.push('</tbody></table>');
    
    return html.join('\n');
}

async function generateCleanPDF() {
    console.log('🚀 Starting clean PDF generation...');
    
    try {
        // Read the markdown file
        const mdPath = path.join(__dirname, 'SKYRAFI_MOBILE_APP_WHITEPAPER.md');
        const mdContent = fs.readFileSync(mdPath, 'utf-8');
        
        // Convert markdown to HTML
        const bodyContent = mdToHtml(mdContent);
        
        // Create HTML with clean styling
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Skyrafi 2.0 Mobile App Development Proposal</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.7;
            color: #1a1a1a;
            background: white;
            padding: 40px;
            max-width: 900px;
            margin: 0 auto;
        }

        h1 {
            font-size: 2.2rem;
            color: #000;
            margin: 30px 0 20px 0;
            border-bottom: 3px solid #000;
            padding-bottom: 15px;
            font-weight: 700;
        }

        h2 {
            font-size: 1.7rem;
            color: #000;
            margin: 30px 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #e0e0e0;
            font-weight: 600;
        }

        h3 {
            font-size: 1.3rem;
            color: #1a1a1a;
            margin: 25px 0 12px 0;
            font-weight: 600;
        }

        h4 {
            font-size: 1.1rem;
            color: #333;
            margin: 20px 0 10px 0;
            font-weight: 600;
        }

        p {
            margin: 12px 0;
            text-align: justify;
            color: #333;
        }

        ul, ol {
            margin: 12px 0 12px 30px;
            color: #333;
        }

        li {
            margin-bottom: 8px;
        }

        strong {
            color: #000;
            font-weight: 600;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            page-break-inside: avoid;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        th {
            background: #2a2a2a;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 700;
            border: 1px solid #000;
            font-size: 0.95rem;
        }

        td {
            padding: 15px;
            border: 1px solid #d0d0d0;
            color: #333;
            font-size: 0.9rem;
        }

        tr:nth-child(even) {
            background: #f7f7f7;
        }

        tr:hover {
            background: #efefef;
        }

        hr {
            border: none;
            border-top: 2px solid #e0e0e0;
            margin: 40px 0;
        }

        code {
            background: #f5f5f5;
            padding: 2px 6px;
            font-family: 'Courier New', monospace;
            color: #000;
            border: 1px solid #e0e0e0;
        }

        blockquote {
            border-left: 4px solid #000;
            padding-left: 20px;
            margin: 20px 0;
            background: #f9f9f9;
            padding: 20px;
        }

        /* Visual boxes for important content */
        ul li strong:first-child::before {
            content: "▪ ";
            font-weight: bold;
        }

        @media print {
            body {
                padding: 20px;
            }
            
            h1, h2, h3, h4, table, ul, ol, blockquote {
                page-break-inside: avoid;
            }
            
            table {
                page-break-inside: avoid;
            }
            
            tr {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
${bodyContent}
</body>
</html>
        `;
        
        // Launch browser
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });
        
        console.log('📄 Generating clean professional PDF...');
        
        const pdfPath = path.join(__dirname, 'Skyrafi_Mobile_App_Proposal_Clean.pdf');
        
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: false,
            margin: {
                top: '60px',
                bottom: '60px',
                left: '50px',
                right: '50px'
            }
        });
        
        await browser.close();
        
        if (fs.existsSync(pdfPath)) {
            const stats = fs.statSync(pdfPath);
            const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
            
            console.log('✅ Clean PDF generated successfully!');
            console.log(`📁 Location: ${pdfPath}`);
            console.log(`📏 Size: ${fileSizeInMB} MB`);
            console.log('🎉 Professional black & white PDF ready!');
            
            return pdfPath;
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    }
}

generateCleanPDF();
