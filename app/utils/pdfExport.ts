import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Interface for the report data
interface ReportData {
  country: string;
  countryCode?: string;
  state: string;
  financialYear: string;
  currency: string;
  currencySymbol: string;
  flagEmoji?: string;
  actualOSR: string;
  budgetedOSR: string;
  population: string;
  gdpPerCapita: string;
  propertyTax?: any;
  license?: any;
  shortTerm?: any;
  longTerm?: any;
  mixedCharge?: any;
}

// Function to format currency values
const formatCurrency = (value: string | number, symbol: string = '$'): string => {
  if (!value) return `${symbol}0`;
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return `${symbol}${numValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
};

// Function to format number values
const formatNumber = (value: string | number): string => {
  if (!value) return '0';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return numValue.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

// Simple country code to flag emoji map for common countries
const countryFlags: { [key: string]: string } = {
  // This is just a small sample - you can expand this with more countries as needed
  us: '🇺🇸',
  ca: '🇨🇦',
  gb: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
  it: '🇮🇹',
  es: '🇪🇸',
  cn: '🇨🇳',
  jp: '🇯🇵',
  br: '🇧🇷',
  in: '🇮🇳',
  au: '🇦🇺',
  ke: '🇰🇪',
  ng: '🇳🇬',
  za: '🇿🇦',
  eg: '🇪🇬',
  mx: '🇲🇽',
  ru: '🇷🇺',
  id: '🇮🇩',
  pk: '🇵🇰',
  bd: '🇧🇩',
  ph: '🇵🇭',
  vn: '🇻🇳',
  tr: '🇹🇷',
  kr: '🇰🇷',
  ir: '🇮🇷',
  sa: '🇸🇦',
  th: '🇹🇭',
  my: '🇲🇾',
  sg: '🇸🇬',
  jo: '🇯🇴',
  // Add more as needed
};

// Function to preload an image
const preloadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Enable CORS
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

// Function to convert image to base64 data URL
const imageToDataURL = (img: HTMLImageElement): string => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(img, 0, 0);
  return canvas.toDataURL('image/png');
};

// Function to generate the cover page
const generateCoverPage = async (doc: jsPDF, reportData: ReportData): Promise<void> => {
  console.log('Generating cover page with report data:', reportData);
  
  // Use the absolute URL to ensure proper loading
  const logoUrl = `${window.location.origin}/logo.d95ced55c7a543c8d241.png`;
  console.log('Attempting to load logo from:', logoUrl);
  
  try {
    // Add ROSRA logo to top left corner
    const img = await preloadImage(logoUrl);
    console.log('Logo loaded successfully');
    const dataUrl = imageToDataURL(img);
    
    // Position the logo in the top left with further reduced width
    doc.addImage(dataUrl, 'PNG', 0.5, 0.5, 2.0, 0.8);
    
    // Now add Norad logo to top right corner
    try {
      const noradLogoUrl = `${window.location.origin}/Light-theme-norad.png`;
      console.log('Attempting to load Norad logo from:', noradLogoUrl);
      const noradImg = await preloadImage(noradLogoUrl);
      const noradDataUrl = imageToDataURL(noradImg);
      
      // Calculate right corner position (page width - logo width - margin)
      const rightX = doc.internal.pageSize.width - 2.5; // 2.0 width + 0.5 margin
      
      // Position Norad logo in top right corner with increased height
      doc.addImage(noradDataUrl, 'PNG', rightX, 0.5, 2.0, 1.0);
      console.log('Norad logo added successfully');
    } catch (noradError) {
      console.error('Error loading Norad logo:', noradError);
    }
  } catch (error) {
    console.error('Error loading logo:', error);
    // Fallback to alternative logo
    try {
      const altLogoUrl = `${window.location.origin}/Light-theme-logo.png`;
      console.log('Attempting to load alternative logo from:', altLogoUrl);
      const altImg = await preloadImage(altLogoUrl);
      const altDataUrl = imageToDataURL(altImg);
      doc.addImage(altDataUrl, 'PNG', 0.5, 0.5, 2.0, 0.8);
      
      // Try to add Norad logo anyway
      try {
        const noradLogoUrl = `${window.location.origin}/Light-theme-norad.png`;
        const noradImg = await preloadImage(noradLogoUrl);
        const noradDataUrl = imageToDataURL(noradImg);
        
        // Calculate right corner position
        const rightX = doc.internal.pageSize.width - 2.5; // 2.0 width + 0.5 margin
        
        // Position Norad logo in top right corner with increased height
        doc.addImage(noradDataUrl, 'PNG', rightX, 0.5, 2.0, 1.0);
      } catch (noradError) {
        console.error('Error loading Norad logo:', noradError);
      }
    } catch (altError) {
      console.error('Error loading alternative logo:', altError);
      // If both logos fail to load, use text fallback
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('ROSRA', 0.5, 0.9);
      
      doc.setFontSize(18);
      doc.text('UN-HABITAT', 0.5, 1.3);
      
      doc.setFontSize(12);
      doc.text('FOR A BETTER URBAN FUTURE', 0.5, 1.6);
      
      // Try to add Norad logo text fallback
      doc.setFontSize(20);
      doc.text('Norad', doc.internal.pageSize.width - 1.0, 0.8, { align: 'right' });
      doc.setFontSize(8);
      doc.text('Norwegian Agency for Development', doc.internal.pageSize.width - 1.0, 1.0, { align: 'right' });
    }
  }
  
  // Add title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('Rapid Own Source Revenue Analysis', doc.internal.pageSize.width / 2, 3.0, { align: 'center' });
  
  // Add subtitle
  doc.setFontSize(16);
  doc.text('for', doc.internal.pageSize.width / 2, 3.5, { align: 'center' });
  
  // Add country and state
  doc.setFontSize(20);
  
  // Create location text
  let locationText = reportData.country || 'Unknown';
  if (reportData.state && reportData.state !== 'Not specified') {
    locationText = `${locationText}, ${reportData.state}`;
  }
  
  console.log('Location text to display:', locationText);
  
  // Try to add flag image if country code is available
  if (reportData.countryCode) {
    try {
      // Use higher resolution flag image but keep smaller size
      const flagUrl = `https://flagcdn.com/256x192/${reportData.countryCode.toLowerCase()}.png`;
      console.log('Flag URL:', flagUrl);
      
      // Preload and convert image to data URL to avoid CORS issues
      const img = await preloadImage(flagUrl);
      const dataUrl = imageToDataURL(img);
      
      // Get text width to calculate proper positioning
      const textWidth = doc.getTextWidth(locationText);
      const centerX = doc.internal.pageSize.width / 2;
      
      // Calculate flag position to align with text
      const flagWidth = 0.8; // Reduced width further
      const flagHeight = 0.6; // Reduced height further
      
      // Calculate the total width of flag + text + spacing
      const spacing = 0.2; // Space between flag and text
      const totalWidth = flagWidth + spacing + textWidth;
      
      // Calculate starting position to center the entire block
      const startX = centerX - (totalWidth / 2);
      
      // Position the flag at the start of the block
      doc.addImage(
        dataUrl, 
        'PNG', 
        startX,
        4.2,  // Adjusted Y position to align with text
        flagWidth,
        flagHeight
      );
      
      // Position the text right after the flag
      doc.text(locationText, startX + flagWidth + spacing, 4.5);
    } catch (error) {
      console.error('Error adding flag image:', error);
      // If flag fails, just center the text
      doc.text(locationText, doc.internal.pageSize.width / 2, 4.5, { align: 'center' });
    }
  } else {
    // If no country code, center the text
    doc.text(locationText, doc.internal.pageSize.width / 2, 4.5, { align: 'center' });
  }
  
  // Add financial year and currency with consistent alignment
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(`Last Financial Year Ending in ${reportData.financialYear}`, doc.internal.pageSize.width / 2, 5.5, { align: 'center' });
  doc.text(`Currency: ${reportData.currency}`, doc.internal.pageSize.width / 2, 6.0, { align: 'center' });
  
  // Add footer
  doc.setFontSize(10);
  doc.text('UN-HABITAT ROSRA Tool', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 0.8, { align: 'center' });
};

// Function to add header with logos to all pages
const addPageHeader = async (doc: jsPDF): Promise<void> => {
  // Use the absolute URL to ensure proper loading
  const logoUrl = `${window.location.origin}/logo.d95ced55c7a543c8d241.png`;
  
  try {
    // Add ROSRA logo to top left corner
    const img = await preloadImage(logoUrl);
    const dataUrl = imageToDataURL(img);
    
    // Position the logo in the top left with smaller dimensions for header
    doc.addImage(dataUrl, 'PNG', 0.5, 0.3, 1.2, 0.5);
    
    // Add Norad logo to top right corner
    try {
      const noradLogoUrl = `${window.location.origin}/Light-theme-norad.png`;
      const noradImg = await preloadImage(noradLogoUrl);
      const noradDataUrl = imageToDataURL(noradImg);
      
      // Calculate right corner position (page width - logo width - margin)
      const rightX = doc.internal.pageSize.width - 1.7; // 1.2 width + 0.5 margin
      
      // Position Norad logo in top right corner with increased height
      doc.addImage(noradDataUrl, 'PNG', rightX, 0.3, 1.2, 0.7);
    } catch (noradError) {
      console.error('Error loading Norad logo for header:', noradError);
    }
  } catch (error) {
    console.error('Error loading logo for header:', error);
    // Try alternative logo
    try {
      const altLogoUrl = `${window.location.origin}/Light-theme-logo.png`;
      const altImg = await preloadImage(altLogoUrl);
      const altDataUrl = imageToDataURL(altImg);
      doc.addImage(altDataUrl, 'PNG', 0.5, 0.3, 1.2, 0.5);
      
      // Try to add Norad logo anyway
      try {
        const noradLogoUrl = `${window.location.origin}/Light-theme-norad.png`;
        const noradImg = await preloadImage(noradLogoUrl);
        const noradDataUrl = imageToDataURL(noradImg);
        
        // Calculate right corner position
        const rightX = doc.internal.pageSize.width - 1.7; // 1.2 width + 0.5 margin
        
        // Position Norad logo in top right corner with increased height
        doc.addImage(noradDataUrl, 'PNG', rightX, 0.3, 1.2, 0.7);
      } catch (noradError) {
        console.error('Error loading Norad logo for header:', noradError);
      }
    } catch (altError) {
      // If both logos fail to load, use text fallback
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('ROSRA', 0.5, 0.6);
      
      doc.setFontSize(11);
      doc.text('UN-HABITAT', 0.5, 0.9);
      
      doc.setFontSize(7);
      doc.text('FOR A BETTER URBAN FUTURE', 0.5, 1.1);
      
      // Text fallback for Norad logo
      doc.setFontSize(14);
      doc.text('Norad', doc.internal.pageSize.width - 0.5, 0.6, { align: 'right' });
      doc.setFontSize(6);
      doc.text('Norwegian Agency for Development', doc.internal.pageSize.width - 0.5, 0.8, { align: 'right' });
    }
  }
};

// Function to generate the summary page
const generateSummaryPage = async (doc: jsPDF, reportData: ReportData): Promise<void> => {
  // Add page title
  doc.addPage();
  
  // Add logo to page header
  await addPageHeader(doc);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Executive Summary', doc.internal.pageSize.width / 2, 1.0, { align: 'center' });
  
  // Add key metrics
  doc.setFontSize(14);
  doc.text('Key Financial Metrics', 1.0, 1.8);
  
  // Create a table for key metrics
  const tableData = [
    ['Metric', 'Value'],
    ['Actual OSR', formatCurrency(reportData.actualOSR, reportData.currencySymbol)],
    ['Budgeted OSR', formatCurrency(reportData.budgetedOSR, reportData.currencySymbol)],
    ['Population', formatNumber(reportData.population)],
    ['GDP per Capita', formatCurrency(reportData.gdpPerCapita, reportData.currencySymbol)]
  ];
  
  autoTable(doc, {
    startY: 2.0,
    head: [tableData[0]],
    body: tableData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255] },
    styles: { halign: 'left' },
    columnStyles: {
      0: { cellWidth: 3.0 },
      1: { cellWidth: 2.5, halign: 'right' }
    }
  });
  
  // Add OSR per capita calculation
  const osrPerCapita = parseFloat(reportData.actualOSR) / parseFloat(reportData.population);
  
  doc.setFontSize(14);
  doc.text('OSR Performance Indicators', 7.0, 1.8);
  
  const performanceData = [
    ['Indicator', 'Value'],
    ['OSR per Capita', formatCurrency(osrPerCapita, reportData.currencySymbol)],
    ['OSR as % of Budget', `${((parseFloat(reportData.actualOSR) / parseFloat(reportData.budgetedOSR)) * 100).toFixed(2)}%`]
  ];
  
  autoTable(doc, {
    startY: 2.0,
    margin: { left: 7.0 },
    head: [performanceData[0]],
    body: performanceData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255] },
    styles: { halign: 'left' },
    columnStyles: {
      0: { cellWidth: 3.0 },
      1: { cellWidth: 2.5, halign: 'right' }
    }
  });
  
  // Add a summary text
  doc.setFontSize(12);
  doc.text('Summary of Analysis:', 1.0, 5.0);
  doc.setFont('helvetica', 'normal');
  doc.text('This report provides a comprehensive analysis of the Own Source Revenue (OSR) for', 1.0, 5.3);
  
  // Format location text based on whether state exists and is not "Not specified"
  const locationText = reportData.state && reportData.state !== 'Not specified'
    ? `${reportData.state}, ${reportData.country}` 
    : reportData.country;
  doc.text(locationText + ` for the financial year ending in ${reportData.financialYear}.`, 1.0, 5.6);
  
  doc.text('The analysis includes potential revenue estimates, gap analysis, and recommendations', 1.0, 5.9);
  doc.text('for improving revenue collection and management.', 1.0, 6.2);
};

// Function to generate property tax analysis page
const generatePropertyTaxPage = async (doc: jsPDF, reportData: ReportData): Promise<void> => {
  if (!reportData.propertyTax || !reportData.propertyTax.categories || reportData.propertyTax.categories.length === 0) {
    return; // Skip if no property tax data
  }
  
  // Add page title
  doc.addPage();
  
  // Add logo to page header
  await addPageHeader(doc);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Property Tax Analysis', doc.internal.pageSize.width / 2, 1.0, { align: 'center' });
  
  // Add property tax metrics
  doc.setFontSize(14);
  doc.text('Property Tax Categories', 1.0, 1.8);
  
  // Create a table for property tax categories
  const tableHead = [['Category', 'Actual Revenue', 'Potential Revenue', 'Gap']];
  const tableBody = reportData.propertyTax.categories.map((category: any) => [
    category.name,
    formatCurrency(category.actualRevenue, reportData.currencySymbol),
    formatCurrency(category.potentialRevenue, reportData.currencySymbol),
    formatCurrency(category.potentialRevenue - category.actualRevenue, reportData.currencySymbol)
  ]);
  
  // Add totals row
  const totalActual = reportData.propertyTax.categories.reduce((sum: number, cat: any) => sum + parseFloat(cat.actualRevenue || 0), 0);
  const totalPotential = reportData.propertyTax.categories.reduce((sum: number, cat: any) => sum + parseFloat(cat.potentialRevenue || 0), 0);
  const totalGap = totalPotential - totalActual;
  
  tableBody.push([
    'TOTAL',
    formatCurrency(totalActual, reportData.currencySymbol),
    formatCurrency(totalPotential, reportData.currencySymbol),
    formatCurrency(totalGap, reportData.currencySymbol)
  ]);
  
  autoTable(doc, {
    startY: 2.0,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255] },
    styles: { halign: 'left' },
    columnStyles: {
      0: { cellWidth: 3.0 },
      1: { cellWidth: 2.0, halign: 'right' },
      2: { cellWidth: 2.0, halign: 'right' },
      3: { cellWidth: 2.0, halign: 'right' }
    },
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' }
  });
  
  // Add property tax analysis text
  const gapPercentage = ((totalGap / totalActual) * 100).toFixed(2);
  
  doc.setFontSize(14);
  doc.text('Property Tax Analysis Summary', 1.0, 5.0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`The property tax analysis shows a total revenue gap of ${formatCurrency(totalGap, reportData.currencySymbol)},`, 1.0, 5.3);
  doc.text(`which represents ${gapPercentage}% of the current actual revenue.`, 1.0, 5.6);
  doc.text('This indicates significant potential for increasing property tax revenue through', 1.0, 5.9);
  doc.text('improved collection efficiency and coverage.', 1.0, 6.2);
};

// Function to generate short term analysis page
const generateShortTermPage = async (doc: jsPDF, reportData: ReportData): Promise<void> => {
  if (!reportData.shortTerm || !reportData.shortTerm.categories || reportData.shortTerm.categories.length === 0) {
    return; // Skip if no short term data
  }
  
  // Add page title
  doc.addPage();
  
  // Add logo to page header
  await addPageHeader(doc);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Short Term User Charge Analysis', doc.internal.pageSize.width / 2, 1.0, { align: 'center' });
  
  // Add short term metrics
  doc.setFontSize(14);
  doc.text('Short Term User Charge Categories', 1.0, 1.8);
  
  // Create a table for short term categories
  const tableHead = [['Category', 'Actual Revenue', 'Potential Revenue', 'Gap']];
  const tableBody = reportData.shortTerm.categories.map((category: any) => [
    category.name,
    formatCurrency(category.actualRevenue, reportData.currencySymbol),
    formatCurrency(category.potentialRevenue, reportData.currencySymbol),
    formatCurrency(category.potentialRevenue - category.actualRevenue, reportData.currencySymbol)
  ]);
  
  // Add totals row
  const totalActual = reportData.shortTerm.categories.reduce((sum: number, cat: any) => sum + parseFloat(cat.actualRevenue || 0), 0);
  const totalPotential = reportData.shortTerm.categories.reduce((sum: number, cat: any) => sum + parseFloat(cat.potentialRevenue || 0), 0);
  const totalGap = totalPotential - totalActual;
  
  tableBody.push([
    'TOTAL',
    formatCurrency(totalActual, reportData.currencySymbol),
    formatCurrency(totalPotential, reportData.currencySymbol),
    formatCurrency(totalGap, reportData.currencySymbol)
  ]);
  
  autoTable(doc, {
    startY: 2.0,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255] },
    styles: { halign: 'left' },
    columnStyles: {
      0: { cellWidth: 3.0 },
      1: { cellWidth: 2.0, halign: 'right' },
      2: { cellWidth: 2.0, halign: 'right' },
      3: { cellWidth: 2.0, halign: 'right' }
    },
    footStyles: { fillColor: [240, 240, 240], fontStyle: 'bold' }
  });
  
  // Add short term analysis text
  const gapPercentage = ((totalGap / totalActual) * 100).toFixed(2);
  
  doc.setFontSize(14);
  doc.text('Short Term User Charge Analysis Summary', 1.0, 5.0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`The short term user charge analysis shows a total revenue gap of ${formatCurrency(totalGap, reportData.currencySymbol)},`, 1.0, 5.3);
  doc.text(`which represents ${gapPercentage}% of the current actual revenue.`, 1.0, 5.6);
  doc.text('This indicates opportunities for increasing short term user charge revenue through', 1.0, 5.9);
  doc.text('improved fee structures and collection methods.', 1.0, 6.2);
};

// Function to generate recommendations page
const generateRecommendationsPage = async (doc: jsPDF, reportData: ReportData): Promise<void> => {
  // Add page title
  doc.addPage();
  
  // Add logo to page header
  await addPageHeader(doc);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Recommendations', doc.internal.pageSize.width / 2, 1.0, { align: 'center' });
  
  // Add recommendations
  doc.setFontSize(14);
  doc.text('Key Recommendations for Revenue Enhancement', 1.0, 1.8);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const recommendations = [
    {
      title: '1. Improve Property Tax Collection',
      details: [
        'Update property valuation records to reflect current market values',
        'Implement digital payment systems to simplify tax collection',
        'Enhance enforcement mechanisms for non-compliant property owners'
      ]
    },
    {
      title: '2. Optimize User Charge Structures',
      details: [
        'Review and adjust fee structures to reflect service costs',
        'Implement progressive fee structures based on usage levels',
        'Expand coverage of user charges to include all beneficiaries'
      ]
    },
    {
      title: '3. Strengthen Revenue Administration',
      details: [
        'Invest in digital revenue management systems',
        'Train staff on modern revenue collection techniques',
        'Establish performance targets for revenue collection'
      ]
    },
    {
      title: '4. Enhance Taxpayer Education',
      details: [
        'Launch public awareness campaigns on the importance of tax compliance',
        'Provide clear information on how tax revenues are utilized',
        'Establish taxpayer service centers for assistance and inquiries'
      ]
    }
  ];
  
  let yPosition = 2.2;
  
  recommendations.forEach(rec => {
    doc.setFont('helvetica', 'bold');
    doc.text(rec.title, 1.0, yPosition);
    yPosition += 0.4;
    
    doc.setFont('helvetica', 'normal');
    rec.details.forEach(detail => {
      doc.text(`• ${detail}`, 1.5, yPosition);
      yPosition += 0.3;
    });
    
    yPosition += 0.2;
  });
  
  // Add implementation timeline
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Implementation Timeline', 7.0, 1.8);
  
  const timelineData = [
    ['Phase', 'Timeline', 'Key Activities'],
    ['Short-term', '0-6 months', 'Digital payment systems, Staff training'],
    ['Medium-term', '6-18 months', 'Property valuation updates, Fee structure review'],
    ['Long-term', '18-36 months', 'Comprehensive system upgrades, Policy reforms']
  ];
  
  autoTable(doc, {
    startY: 2.2,
    margin: { left: 7.0 },
    head: [timelineData[0]],
    body: timelineData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [0, 128, 0], textColor: [255, 255, 255] },
    styles: { halign: 'left' },
    columnStyles: {
      0: { cellWidth: 1.5 },
      1: { cellWidth: 1.5 },
      2: { cellWidth: 2.5 }
    }
  });
};

// Function to generate the OSR gap analysis page
const generateGapAnalysisPage = async (doc: jsPDF, reportData: ReportData): Promise<void> => {
  // Add a new page for the gap analysis
  doc.addPage();
  
  // Add logo to page header
  await addPageHeader(doc);
  
  // Add page title with enhanced formatting
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('OSR Gap Analysis', doc.internal.pageSize.width / 2, 1.0, { align: 'center' });
  
  // Add subtitle with location
  doc.setFontSize(14);
  // Format location text based on whether state exists and is not "Not specified"
  const locationText = reportData.state && reportData.state !== 'Not specified'
    ? `${reportData.state}, ${reportData.country}` 
    : reportData.country;
  doc.text(locationText, doc.internal.pageSize.width / 2, 1.3, { align: 'center' });
  doc.text(`Financial Year ${reportData.financialYear}`, doc.internal.pageSize.width / 2, 1.6, { align: 'center' });
  
  // Capture the gap analysis chart from the UI
  try {
    const gapChartElement = document.querySelector('.gap-analysis-chart');
    if (gapChartElement) {
      console.log('Found gap analysis chart element, generating image...');
      
      // Use html2canvas to capture the chart as an image
      const canvas = await html2canvas(gapChartElement as HTMLElement);
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to maintain aspect ratio - reducing size to allow more space
      const chartAspectRatio = canvas.width / canvas.height;
      const chartWidth = 7.5; // Further reduced width to ensure better fit
      const chartHeight = chartWidth / chartAspectRatio;
      
      // Position the chart in the center of the page
      const xPos = (doc.internal.pageSize.width - chartWidth) / 2;
      
      // Add the chart image to the PDF - moved even higher
      doc.addImage(imgData, 'PNG', xPos, 1.9, chartWidth, chartHeight);
      
      console.log('Successfully added gap analysis chart to PDF');
    } else {
      console.warn('Could not find gap analysis chart element in the DOM');
      
      // If we couldn't find the chart element, add a fallback table using the reportData
      generateFallbackGapAnalysisTable(doc, reportData);
    }
  } catch (error) {
    console.error('Error capturing gap analysis chart:', error);
    
    // If there was an error capturing the chart, add a fallback table
    generateFallbackGapAnalysisTable(doc, reportData);
  }
  
  // Calculate the estimated chart bottom position - significantly increased
  const estimatedChartBottom = 6.5; // Further increased to avoid any possible overlap
  
  // Add a visual separator line to clearly separate chart from text
  doc.setDrawColor(200, 200, 200); // Light gray
  doc.setLineWidth(0.01);
  doc.line(1.0, estimatedChartBottom - 0.3, doc.internal.pageSize.width - 1.0, estimatedChartBottom - 0.3);
  
  // Add explanatory text below the chart - with increased spacing
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('OSR Gap Analysis Methodology', doc.internal.pageSize.width / 2, estimatedChartBottom, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('The chart above shows the gap between actual OSR collection per capita and the estimated', 
    doc.internal.pageSize.width / 2, estimatedChartBottom + 0.4, { align: 'center' });
  doc.text('potential OSR based on the UN-Habitat methodology.', 
    doc.internal.pageSize.width / 2, estimatedChartBottom + 0.7, { align: 'center' });
    
  // Add the formula with better spacing
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Formula: OSR Potential = (GDP per capita / 1500) × 50', 
    doc.internal.pageSize.width / 2, estimatedChartBottom + 1.2, { align: 'center' });
  
  // Add explanation of the formula with better spacing
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text('This formula estimates that a local government should be able to collect approximately 3.33% of the GDP per capita as Own Source Revenue.',
    doc.internal.pageSize.width / 2, estimatedChartBottom + 1.6, { align: 'center' });
  
  // Add the analysis text directly from the page without trying to find it in the DOM
  // Calculate relevant metrics to determine which analysis text to show
  const gdpPerCapita = parseFloat(reportData.gdpPerCapita);
  const actualOSR = parseFloat(reportData.actualOSR);
  const population = parseFloat(reportData.population);
  
  let analysisText = '';
  if (!isNaN(gdpPerCapita) && !isNaN(actualOSR) && !isNaN(population) && population > 0) {
    const actualOSRPerCapita = actualOSR / population;
    const unHabitatEstimate = (gdpPerCapita / 1500) * 50;
    const percentageGap = (actualOSRPerCapita / unHabitatEstimate);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Gap Analysis', doc.internal.pageSize.width / 2, estimatedChartBottom + 2.2, { align: 'center' });
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    // Use the same logic and exact text from getAnalysisText() in PotentialEstimates.tsx
    if (percentageGap < 0.3) {
      analysisText = 'Your OSR collection is significantly below potential. Consider reviewing your revenue policies and collection methods.';
    } else if (percentageGap < 0.6) {
      analysisText = 'Your OSR collection shows room for improvement. Focus on strengthening existing revenue streams.';
    } else if (percentageGap < 0.9) {
      analysisText = 'Your OSR collection is good but could be optimized further.';
    } else {
      analysisText = 'Your OSR collection is very strong, meeting or exceeding estimates.';
    }
    
    // Create a blue background box for the analysis text
    const boxWidth = 9; // Box width in inches
    const boxHeight = 1; // Box height in inches
    const boxX = (doc.internal.pageSize.width - boxWidth) / 2;
    const boxY = estimatedChartBottom + 2.6;
    
    // Draw blue background
    doc.setFillColor(239, 246, 255); // Light blue color similar to bg-blue-50
    doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 0.2, 0.2, 'F');
    
    // Add text on the blue background
    doc.setTextColor(55, 65, 81); // Dark gray similar to text-gray-700
    const textLines = doc.splitTextToSize(analysisText, boxWidth - 1);
    doc.text(textLines, doc.internal.pageSize.width / 2, boxY + 0.5, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
  }
};

// Fallback function to generate a table with gap analysis data
const generateFallbackGapAnalysisTable = (doc: jsPDF, reportData: ReportData): void => {
  if (!reportData.gdpPerCapita || !reportData.population || !reportData.actualOSR) {
    doc.setFontSize(12);
    doc.text('Insufficient data to generate gap analysis.', 
      doc.internal.pageSize.width / 2, 4.0, { align: 'center' });
    return;
  }
  
  const gdpPerCapita = parseFloat(reportData.gdpPerCapita);
  const population = parseFloat(reportData.population);
  const actualOSR = parseFloat(reportData.actualOSR);
  const budgetedOSR = parseFloat(reportData.budgetedOSR) || 0;
  
  if (isNaN(gdpPerCapita) || isNaN(population) || isNaN(actualOSR) || population === 0) {
    doc.setFontSize(12);
    doc.text('Invalid data for gap analysis calculation.', 
      doc.internal.pageSize.width / 2, 4.0, { align: 'center' });
    return;
  }
  
  // Calculate the values
  const actualOSRPerCapita = actualOSR / population;
  const budgetedOSRPerCapita = budgetedOSR ? budgetedOSR / population : 0;
  const unHabitatEstimate = (gdpPerCapita / 1500) * 50;
  const revenueGap = Math.max(0, unHabitatEstimate - actualOSRPerCapita);
  const percentageOfPotential = (actualOSRPerCapita / unHabitatEstimate) * 100;
  const budgetExecutionRate = budgetedOSR ? (actualOSR / budgetedOSR) * 100 : 0;
  
  // Add title for the table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('OSR Gap Analysis Data', doc.internal.pageSize.width / 2, 3.0, { align: 'center' });
  
  // Create the table data
  const tableData = [
    ['Metric', 'Value', 'Notes'],
    ['GDP per Capita', `${reportData.currencySymbol}${formatCurrency(gdpPerCapita, '')}`, 'Economic capacity indicator'],
    ['Actual OSR', `${reportData.currencySymbol}${formatCurrency(actualOSR, '')}`, 'Total collected'],
    ['Actual OSR Per Capita', `${reportData.currencySymbol}${formatCurrency(actualOSRPerCapita, '')}`, 'Individual contribution'],
    ['UN-Habitat Estimated Potential', `${reportData.currencySymbol}${formatCurrency(unHabitatEstimate, '')}`, 'Target OSR per capita'],
    ['Revenue Gap per Capita', `${reportData.currencySymbol}${formatCurrency(revenueGap, '')}`, 'Gap to close'],
    ['Percentage of Potential Achieved', `${percentageOfPotential.toFixed(1)}%`, 'Performance indicator']
  ];
  
  // Add budgeted OSR data if available
  if (!isNaN(budgetedOSR) && budgetedOSR > 0) {
    tableData.push(
      ['Budgeted OSR', `${reportData.currencySymbol}${formatCurrency(budgetedOSR, '')}`, 'Planned collection'],
      ['Budgeted OSR Per Capita', `${reportData.currencySymbol}${formatCurrency(budgetedOSRPerCapita, '')}`, 'Planned per person'],
      ['Budget Execution Rate', `${budgetExecutionRate.toFixed(1)}%`, 'Collection efficiency']
    );
  }
  
  // Add the table to the PDF with improved styling
  autoTable(doc, {
    startY: 3.5,
    head: [tableData[0]],
    body: tableData.slice(1),
    theme: 'grid',
    headStyles: { 
      fillColor: [0, 128, 0], 
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center' 
    },
    styles: { 
      font: 'helvetica',
      overflow: 'linebreak',
      cellPadding: 4
    },
    columnStyles: {
      0: { cellWidth: 3.0, fontStyle: 'bold' },
      1: { cellWidth: 2.5, halign: 'right' },
      2: { cellWidth: 4.0, fontStyle: 'italic', textColor: [100, 100, 100] }
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });
  
  // Estimate table height based on number of rows
  const estimatedTableHeight = 3.5 + (tableData.length * 0.25); // Base Y + rows × approximate height per row
  
  // Add supplementary explanation
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('OSR Gap Analysis Explanation:', 1.0, estimatedTableHeight + 1.0);
  
  doc.setFont('helvetica', 'normal');
  const explanationText = 'The table above presents key metrics for analyzing the gap between current Own Source Revenue (OSR) ' +
    'collection and the potential based on the UN-Habitat methodology. The methodology suggests that local governments should ' +
    'be able to collect approximately 3.33% of GDP per capita as OSR (calculated as GDP per capita / 1500 × 50). This provides ' +
    'a benchmark against which to assess current performance and identify potential for improvement.';
  
  const explanationLines = doc.splitTextToSize(explanationText, doc.internal.pageSize.width - 2);
  doc.text(explanationLines, 1.0, estimatedTableHeight + 1.4);
};

// Main export function
export const exportAnalysisReport = async (reportData: ReportData): Promise<void> => {
  try {
    console.log('Starting PDF export with data:', reportData);
    
    // Create a new PDF document with landscape orientation
    const doc = new jsPDF({
      orientation: 'landscape', // Change to landscape
      unit: 'in',               // Change unit to inches
      format: [11.69, 8.27]     // Specify exact dimensions in inches
    });
    
    // Generate cover page (awaiting for image loading)
    await generateCoverPage(doc, reportData);
    
    // Generate gap analysis page as the main focus
    await generateGapAnalysisPage(doc, reportData);
    
    // Generate property tax analysis page if data exists
    if (reportData.propertyTax) {
      await generatePropertyTaxPage(doc, reportData);
    }
    
    // Generate short term analysis page if data exists
    if (reportData.shortTerm) {
      await generateShortTermPage(doc, reportData);
    }
    
    // Save the PDF - removed Executive Summary and Recommendations
    doc.save(`ROSRA_Analysis_${reportData.country}_${reportData.financialYear}.pdf`);
    console.log('PDF export completed successfully');
  } catch (error) {
    console.error('Error during PDF export:', error);
  }
};
