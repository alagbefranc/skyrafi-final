const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    console.log('🚀 Starting PDF generation...');
    
    try {
        // Launch browser
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Set viewport for consistent rendering
        await page.setViewport({
            width: 1200,
            height: 800,
            deviceScaleFactor: 2
        });
        
        // Get the absolute path to the HTML file
        const htmlPath = path.join(__dirname, 'Skyrafi_Mobile_App_WhitePaper.html');
        const fileUrl = `file://${htmlPath.replace(/\\/g, '/')}`;
        
        console.log('📄 Loading HTML file...');
        await page.goto(fileUrl, { 
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        
        // Wait for all images and content to load
        await page.waitForTimeout(2000);
        
        // Add some CSS for better PDF printing
        await page.addStyleTag({
            content: `
                @media print {
                    body {
                        background: white !important;
                        padding: 0 !important;
                    }
                    
                    .container {
                        box-shadow: none !important;
                        margin: 0 !important;
                        max-width: none !important;
                    }
                    
                    .header::before {
                        display: none !important;
                    }
                    
                    /* Ensure interactive elements look good in PDF */
                    .cta-button, #approve-btn {
                        background: #1F7EBF !important;
                        color: white !important;
                        text-decoration: none !important;
                        display: inline-block !important;
                        padding: 20px 40px !important;
                        border-radius: 50px !important;
                        font-weight: 700 !important;
                    }
                    
                    /* Hide modal */
                    #approval-modal {
                        display: none !important;
                    }
                    
                    /* Ensure proper page breaks */
                    .section {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    
                    .phase-timeline .phase {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                    
                    .table {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }
                }
            `
        });
        
        console.log('📊 Generating PDF...');
        
        // Generate PDF with high quality settings
        const pdfPath = path.join(__dirname, 'Skyrafi_Mobile_App_WhitePaper.pdf');
        
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            displayHeaderFooter: true,
            headerTemplate: `
                <div style="font-size: 10px; width: 100%; text-align: center; color: #666; padding: 10px 0;">
                    <span>Skyrafi 2.0 Mobile App Development - Executive White Paper</span>
                </div>
            `,
            footerTemplate: `
                <div style="font-size: 10px; width: 100%; text-align: center; color: #666; padding: 10px 0;">
                    <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span> | Confidential & Proprietary</span>
                </div>
            `,
            margin: {
                top: '80px',
                bottom: '80px',
                left: '20px',
                right: '20px'
            }
        });
        
        await browser.close();
        
        // Check if PDF was created successfully
        if (fs.existsSync(pdfPath)) {
            const stats = fs.statSync(pdfPath);
            const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
            
            console.log('✅ PDF generated successfully!');
            console.log(`📁 Location: ${pdfPath}`);
            console.log(`📏 Size: ${fileSizeInMB} MB`);
            console.log('🎉 Your professional white paper PDF is ready!');
            
            return pdfPath;
        } else {
            throw new Error('PDF file was not created');
        }
        
    } catch (error) {
        console.error('❌ Error generating PDF:', error.message);
        throw error;
    }
}

// Run the PDF generation
generatePDF()
    .then((pdfPath) => {
        console.log('\n🚀 Success! Your PDF is ready for client presentation.');
        console.log(`📧 You can now email: ${path.basename(pdfPath)}`);
    })
    .catch((error) => {
        console.error('\n💥 PDF generation failed:', error.message);
        console.log('\n🔧 Alternative options:');
        console.log('1. Open the HTML file in Chrome and use Ctrl+P → Save as PDF');
        console.log('2. Use an online HTML to PDF converter');
        console.log('3. Install wkhtmltopdf for command-line PDF generation');
    });