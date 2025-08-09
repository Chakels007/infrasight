// InfraSight - Main Application Logic

// Global state
let uploadedFiles = [];
let analysisResults = {};
let currentImageUrl = null;

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const askBtn = document.getElementById('askBtn');
    const questionInput = document.getElementById('questionInput');

    // Upload area events
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    fileInput.addEventListener('change', handleFileSelect);
    analyzeBtn.addEventListener('click', startAnalysis);
    askBtn.addEventListener('click', askQuestion);
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') askQuestion();
    });
});

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.closest('.upload-area').classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.closest('.upload-area').classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.closest('.upload-area').classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

function processFiles(files) {
    files.forEach(file => {
        if (uploadedFiles.length < 5) { // Limit to 5 files for demo
            uploadedFiles.push(file);
            displayFile(file);
        }
    });
    
    document.getElementById('analyzeBtn').disabled = uploadedFiles.length === 0;
}

function displayFile(file) {
    const container = document.getElementById('uploadedFiles');
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const preview = document.createElement('div');
    preview.className = 'file-preview';
    preview.style.background = '#e2e8f0';
    preview.style.display = 'flex';
    preview.style.alignItems = 'center';
    preview.style.justifyContent = 'center';
    preview.style.fontSize = '1.5rem';
    
    if (file.type.startsWith('image/')) {
        const img = document.createElement('img');
        img.className = 'file-preview';
        img.src = URL.createObjectURL(file);
        preview.appendChild(img);
        currentImageUrl = img.src;
    } else if (file.type.startsWith('video/')) {
        preview.textContent = '🎥';
    } else if (file.type === 'application/pdf') {
        preview.textContent = '📄';
    } else {
        preview.textContent = '📎';
    }
    
    const info = document.createElement('div');
    info.className = 'file-info';
    info.innerHTML = `
        <div class="file-name">${file.name}</div>
        <div class="file-size">${formatFileSize(file.size)}</div>
    `;
    
    fileItem.appendChild(preview);
    fileItem.appendChild(info);
    container.appendChild(fileItem);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function startAnalysis() {
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const resultsContainer = document.getElementById('analysisResults');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    // Show progress
    progressBar.style.display = 'block';
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<div class="loading-spinner"></div>Analyzing...';
    
    // Simulate progressive analysis
    const steps = [
        { progress: 20, message: 'Extracting text and labels (OCR)...', delay: 1000 },
        { progress: 40, message: 'Detecting defects and components...', delay: 1500 },
        { progress: 60, message: 'Segmenting areas of interest...', delay: 1200 },
        { progress: 80, message: 'Analyzing severity and priority...', delay: 1000 },
        { progress: 100, message: 'Generating report...', delay: 800 }
    ];
    
    for (let step of steps) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
        progressFill.style.width = step.progress + '%';
        updateStatus(step.message);
    }
    
    // Generate mock analysis results
    generateMockResults();
    
    // Hide progress and reset button
    progressBar.style.display = 'none';
    analyzeBtn.disabled = false;
    analyzeBtn.innerHTML = '🔬 Start Analysis';
    
    // Show Q&A interface
    document.getElementById('qaInterface').style.display = 'block';
    
    // Show report preview
    generateReport();
}

function updateStatus(message) {
    const status = document.createElement('div');
    status.className = 'status-indicator';
    status.textContent = message;
    
    // Replace existing status or add new one
    const existing = document.querySelector('.status-indicator');
    if (existing) {
        existing.textContent = message;
    } else {
        document.getElementById('analysisResults').appendChild(status);
    }
}

function generateMockResults() {
    const resultsContainer = document.getElementById('analysisResults');
    
    // Mock defects based on uploaded files
    const mockDefects = [
        {
            type: 'Structural Crack',
            severity: 'high',
            description: 'Vertical crack detected in concrete surface, approximately 15cm length',
            location: 'Grid: A-3, Coordinates: (245, 156)',
            confidence: 0.94
        },
        {
            type: 'Corrosion',
            severity: 'medium',
            description: 'Surface rust on metal fasteners, affecting 3 bolt heads',
            location: 'Grid: B-2, Coordinates: (189, 298)',
            confidence: 0.87
        },
        {
            type: 'Missing Component',
            severity: 'low',
            description: 'Protective cap missing from electrical junction',
            location: 'Grid: C-1, Coordinates: (334, 78)',
            confidence: 0.92
        }
    ];

    const ocrResults = [
        'Asset ID: INF-2024-0847',
        'Installation Date: 03/15/2019',
        'Last Inspection: 11/22/2023',
        'Voltage Rating: 480V',
        'Manufacturer: TechCorp Industries'
    ];

    analysisResults = { defects: mockDefects, ocr: ocrResults };
    
    resultsContainer.innerHTML = `
        <div class="result-section">
            <div class="result-title">
                🎯 Detected Defects (${mockDefects.length})
            </div>
            ${mockDefects.map(defect => `
                <div class="defect-item">
                    <div class="defect-header">
                        <div class="defect-type">${defect.type}</div>
                        <div class="severity ${defect.severity}">${defect.severity.toUpperCase()}</div>
                    </div>
                    <div class="defect-description">${defect.description}</div>
                    <div class="defect-location">📍 ${defect.location} | Confidence: ${Math.round(defect.confidence * 100)}%</div>
                </div>
            `).join('')}
        </div>

        <div class="result-section">
            <div class="result-title">
                📄 Extracted Information (OCR)
            </div>
            ${ocrResults.map(text => `
                <div style="padding: 8px; background: white; margin: 5px 0; border-radius: 4px; border-left: 3px solid #667eea;">
                    ${text}
                </div>
            `).join('')}
        </div>

        ${currentImageUrl ? `
            <div class="result-section">
                <div class="result-title">
                    🖼️ Annotated Analysis
                </div>
                <div class="image-overlay">
                    <img src="${currentImageUrl}" class="analysis-image" id="analysisImage">
                    <canvas class="overlay-canvas" id="overlayCanvas"></canvas>
                </div>
            </div>
        ` : ''}
    `;

    // Add overlay annotations if image exists
    if (currentImageUrl) {
        setTimeout(addImageOverlays, 500);
    }
}

function addImageOverlays() {
    const img = document.getElementById('analysisImage');
    const canvas = document.getElementById('overlayCanvas');
    
    if (!img || !canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to match image
    canvas.width = img.offsetWidth;
    canvas.height = img.offsetHeight;
    
    // Mock overlay annotations
    const annotations = [
        { x: 0.3, y: 0.2, width: 0.15, height: 0.08, color: '#ff6b6b', label: 'Crack' },
        { x: 0.6, y: 0.4, width: 0.12, height: 0.06, color: '#ffa726', label: 'Corrosion' },
        { x: 0.7, y: 0.7, width: 0.08, height: 0.05, color: '#66bb6a', label: 'Missing' }
    ];
    
    annotations.forEach(ann => {
        const x = ann.x * canvas.width;
        const y = ann.y * canvas.height;
        const w = ann.width * canvas.width;
        const h = ann.height * canvas.height;
        
        // Draw bounding box
        ctx.strokeStyle = ann.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, w, h);
        
        // Draw label
        ctx.fillStyle = ann.color;
        ctx.fillRect(x, y - 25, ctx.measureText(ann.label).width + 10, 25);
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText(ann.label, x + 5, y - 8);
    });
}

async function askQuestion() {
    const questionInput = document.getElementById('questionInput');
    const qaResults = document.getElementById('qaResults');
    const askBtn = document.getElementById('askBtn');
    
    if (!questionInput.value.trim()) return;
    
    const question = questionInput.value;
    
    // Show loading
    askBtn.disabled = true;
    askBtn.innerHTML = '<div class="loading-spinner"></div>Processing...';
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock answer based on question
    const mockAnswer = generateMockAnswer(question);
    
    const answerDiv = document.createElement('div');
    answerDiv.className = 'answer';
    answerDiv.innerHTML = `
        <strong>Q:</strong> ${question}<br><br>
        <strong>A:</strong> ${mockAnswer}
    `;
    
    qaResults.appendChild(answerDiv);
    
    // Reset input
    questionInput.value = '';
    askBtn.disabled = false;
    askBtn.innerHTML = 'Ask Question';
}

function generateMockAnswer(question) {
    const q = question.toLowerCase();
    
    if (q.includes('crack') || q.includes('damage')) {
        return 'Based on the analysis, there is a vertical structural crack approximately 15cm in length detected in the concrete surface. The crack appears to be surface-level but should be monitored for expansion. Recommended action: Apply crack sealer within 30 days and schedule follow-up inspection in 6 months.';
    } else if (q.includes('cost') || q.includes('price')) {
        return 'Estimated repair costs: Crack repair: $250-400, Corrosion treatment: $150-200, Component replacement: $75-100. Total estimated cost: $475-700. These estimates include materials and basic labor but may vary based on local rates and specific requirements.';
    } else if (q.includes('urgent') || q.includes('priority')) {
        return 'The structural crack has been classified as HIGH priority due to its location and size. The corrosion is MEDIUM priority and should be addressed within 60 days. The missing protective cap is LOW priority but should be replaced during next scheduled maintenance.';
    } else if (q.includes('time') || q.includes('schedule')) {
        return 'Recommended repair schedule: 1) Address structural crack within 2 weeks (HIGH priority), 2) Treat corrosion within 60 days (MEDIUM priority), 3) Replace missing component during next maintenance cycle (LOW priority). Total estimated repair time: 4-6 hours.';
    } else {
        return 'Based on the inspection data and detected defects, I can provide specific information about structural integrity, repair priorities, cost estimates, and maintenance schedules. The analysis shows 3 defects requiring attention, with 1 high-priority item needing immediate action.';
    }
}

function generateReport() {
    const reportPreview = document.getElementById('reportPreview');
    const reportDate = document.getElementById('reportDate');
    const reportContent = document.getElementById('reportContent');
    
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    reportDate.textContent = `Generated on ${currentDate}`;
    
    const defects = analysisResults.defects || [];
    const highPriority = defects.filter(d => d.severity === 'high').length;
    const mediumPriority = defects.filter(d => d.severity === 'medium').length;
    const lowPriority = defects.filter(d => d.severity === 'low').length;
    
    reportContent.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
                <h3 style="color: #2d3748; margin-bottom: 10px;">📊 Summary</h3>
                <div style="background: #f7fafc; padding: 15px; border-radius: 8px;">
                    <div>🔴 High Priority: ${highPriority}</div>
                    <div>🟡 Medium Priority: ${mediumPriority}</div>
                    <div>🟢 Low Priority: ${lowPriority}</div>
                    <div style="margin-top: 10px; font-weight: 600;">Total Issues: ${defects.length}</div>
                </div>
            </div>
            
            <div>
                <h3 style="color: #2d3748; margin-bottom: 10px;">💰 Cost Estimate</h3>
                <div style="background: #f7fafc; padding: 15px; border-radius: 8px;">
                    <div>Materials: $200-350</div>
                    <div>Labor: $275-350</div>
                    <div style="margin-top: 10px; font-weight: 600; color: #667eea;">Total: $475-700</div>
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #2d3748; margin-bottom: 10px;">🔧 Recommended Actions</h3>
            <div style="background: #f7fafc; padding: 15px; border-radius: 8px;">
                <ol style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 8px;"><strong>Immediate (0-2 weeks):</strong> Address structural crack with professional crack sealer</li>
                    <li style="margin-bottom: 8px;"><strong>Short term (30-60 days):</strong> Treat surface corrosion on metal fasteners</li>
                    <li style="margin-bottom: 8px;"><strong>Next maintenance cycle:</strong> Replace missing protective components</li>
                </ol>
            </div>
        </div>
        
        <div>
            <h3 style="color: #2d3748; margin-bottom: 10px;">🏷️ Asset Information</h3>
            <div style="background: #f7fafc; padding: 15px; border-radius: 8px;">
                ${(analysisResults.ocr || []).map(info => `<div style="margin-bottom: 5px;">• ${info}</div>`).join('')}
            </div>
        </div>
    `;
    
    reportPreview.style.display = 'block';
}

function exportReport() {
    // Simulate PDF export
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: #48bb78; color: white; 
        padding: 15px 20px; border-radius: 8px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000; font-weight: 600;
    `;
    notification.textContent = '📄 Report exported successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
    
    // In real implementation, this would generate and download a PDF
    console.log('Exporting comprehensive inspection report...');
}

function createTicket() {
    // Simulate ticket creation
    const ticketModal = document.createElement('div');
    ticketModal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); display: flex; align-items: center;
        justify-content: center; z-index: 1001;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white; border-radius: 15px; padding: 30px;
        max-width: 500px; width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    `;
    
    modal.innerHTML = `
        <h2 style="margin-bottom: 20px; color: #2d3748;">🎫 Create Work Order</h2>
        
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Priority Level:</label>
            <select style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                <option>High - Structural Crack Repair</option>
                <option>Medium - Corrosion Treatment</option>
                <option>Low - Component Replacement</option>
            </select>
        </div>
        
        <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Assigned Team:</label>
            <select style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;">
                <option>Infrastructure Maintenance Team</option>
                <option>Electrical Systems Team</option>
                <option>General Repairs Team</option>
            </select>
        </div>
        
        <div style="margin-bottom: 20px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600;">Estimated Completion:</label>
            <input type="date" style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px;" 
                   value="${new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0]}">
        </div>
        
        <div style="display: flex; gap: 10px;">
            <button onclick="submitTicket()" style="flex: 1; background: #667eea; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600;">
                Create Ticket
            </button>
            <button onclick="this.closest('.modal-overlay').remove()" style="flex: 1; background: #e2e8f0; color: #4a5568; border: none; padding: 12px; border-radius: 8px; font-weight: 600;">
                Cancel
            </button>
        </div>
    `;
    
    ticketModal.className = 'modal-overlay';
    ticketModal.appendChild(modal);
    document.body.appendChild(ticketModal);
}

function submitTicket() {
    document.querySelector('.modal-overlay').remove();
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: #667eea; color: white; 
        padding: 15px 20px; border-radius: 8px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000; font-weight: 600;
    `;
    notification.textContent = '🎫 Work order INF-2025-001 created successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 4000);
}

function shareReport() {
    // Simulate sharing options
    const shareModal = document.createElement('div');
    shareModal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5); display: flex; align-items: center;
        justify-content: center; z-index: 1001;
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white; border-radius: 15px; padding: 30px;
        max-width: 400px; width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    `;
    
    modal.innerHTML = `
        <h2 style="margin-bottom: 20px; color: #2d3748;">📤 Share Report</h2>
        
        <div style="display: grid; gap: 10px; margin-bottom: 20px;">
            <button onclick="shareViaEmail()" style="background: #e53e3e; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600;">
                📧 Email
            </button>
            <button onclick="shareViaSlack()" style="background: #4a154b; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600;">
                💬 Slack
            </button>
            <button onclick="copyShareLink()" style="background: #667eea; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600;">
                🔗 Copy Link
            </button>
        </div>
        
        <button onclick="this.closest('.modal-overlay').remove()" style="width: 100%; background: #e2e8f0; color: #4a5568; border: none; padding: 12px; border-radius: 8px; font-weight: 600;">
            Close
        </button>
    `;
    
    shareModal.className = 'modal-overlay';
    shareModal.appendChild(modal);
    document.body.appendChild(shareModal);
}

function shareViaEmail() {
    document.querySelector('.modal-overlay').remove();
    showNotification('📧 Email draft created with report attachment', '#e53e3e');
}

function shareViaSlack() {
    document.querySelector('.modal-overlay').remove();
    showNotification('💬 Report shared to #infrastructure-alerts', '#4a154b');
}

function copyShareLink() {
    document.querySelector('.modal-overlay').remove();
    showNotification('🔗 Report link copied to clipboard', '#667eea');
}

function showNotification(message, color) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; 
        background: ${color}; color: white; 
        padding: 15px 20px; border-radius: 8px; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000; font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// Demo data for different file types
function generateContextualResults(fileType) {
    const contexts = {
        'bridge': {
            defects: [
                { type: 'Concrete Spalling', severity: 'high', description: 'Concrete deterioration on support beam', location: 'Span 2, South Support' },
                { type: 'Rebar Exposure', severity: 'medium', description: 'Steel reinforcement visible through concrete', location: 'Deck Section A-4' },
                { type: 'Expansion Joint Damage', severity: 'medium', description: 'Rubber seal torn, debris accumulation', location: 'North Approach' }
            ],
            ocr: ['Bridge ID: BR-2024-847', 'Load Rating: HS-20', 'Last Inspection: 2023-11-15']
        },
        'electrical': {
            defects: [
                { type: 'Insulation Damage', severity: 'high', description: 'Wire insulation cracking, potential short risk', location: 'Panel B, Circuit 12' },
                { type: 'Corrosion', severity: 'medium', description: 'Surface rust on junction box', location: 'Exterior Mount Point 3' },
                { type: 'Missing Cover', severity: 'low', description: 'Protective cover missing from outlet', location: 'East Wall, 4ft height' }
            ],
            ocr: ['Voltage: 480V/277V', 'Panel ID: EP-2024-156', 'Installation: 2019-03-15']
        },
        'hvac': {
            defects: [
                { type: 'Filter Blockage', severity: 'medium', description: 'Air filter 85% blocked, reduced airflow', location: 'Unit 3, Return Plenum' },
                { type: 'Refrigerant Leak', severity: 'high', description: 'Oil stains indicate refrigerant leak', location: 'Condenser Coil Connection' },
                { type: 'Belt Wear', severity: 'low', description: 'Fan belt showing wear, replacement recommended', location: 'Blower Assembly' }
            ],
            ocr: ['Unit ID: HVAC-2024-089', 'Model: TR-5000X', 'Service Date: 2024-01-10']
        }
    };
    
    // Return default or contextual results
    return contexts['electrical'] || contexts['bridge']; // Default to electrical for demo
}