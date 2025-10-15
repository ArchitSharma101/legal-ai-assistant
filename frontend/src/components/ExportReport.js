import React, { useState } from 'react';
import axios from 'axios';
import Modal from './ui/modal';
import Button from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Loading } from './ui/loading';
import { useToast } from './ui/toast';
import RiskMeter from './RiskMeter';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ExportReport = ({ isOpen, onClose, document, analysis }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [includeSections, setIncludeSections] = useState({
    summary: true,
    clauses: true,
    risks: true,
    qa: true
  });
  const { toast } = useToast();

  // Calculate risk level from analysis
  const getRiskLevel = () => {
    if (!analysis?.risk_assessment) return 'low';

    const riskText = analysis.risk_assessment.toLowerCase();
    if (riskText.includes('high') || riskText.includes('severe') || riskText.includes('critical')) {
      return 'high';
    } else if (riskText.includes('medium') || riskText.includes('moderate')) {
      return 'medium';
    }
    return 'low';
  };

  const handleExport = async () => {
    if (!document || !analysis) return;

    setIsExporting(true);
    try {
      const exportData = {
        document_id: document.id,
        format: exportFormat,
        sections: includeSections
      };

      const response = await axios.post(`${API}/documents/${document.id}/export`, exportData, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      const fileExtension = exportFormat === 'pdf' ? 'pdf' : 'docx';
      link.setAttribute('download', `${document.filename.replace(/\.[^/.]+$/, '')}_analysis.${fileExtension}`);

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Report exported as ${exportFormat.toUpperCase()}`,
        variant: "success"
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  const handleSectionToggle = (section) => {
    setIncludeSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasSelectedSections = Object.values(includeSections).some(selected => selected);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="EXPORT ANALYSIS REPORT"
      size="large"
    >
      <div className="export-modal">
        <div className="export-header">
          <div className="document-info">
            <h4>DOCUMENT: {document?.filename}</h4>
            <div className="risk-display">
              <RiskMeter riskLevel={getRiskLevel()} />
            </div>
          </div>
          <p className="export-description">Select sections and format for professional report generation</p>
        </div>

        <Card className="export-options">
          <CardHeader>
            <h5>Export Format</h5>
          </CardHeader>
          <CardContent>
            <div className="format-options">
              <label className={`format-option ${exportFormat === 'pdf' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="pdf"
                  checked={exportFormat === 'pdf'}
                  onChange={(e) => setExportFormat(e.target.value)}
                />
                <div className="format-content">
                  <span className="format-icon">📄</span>
                  <div>
                    <strong>PDF Report</strong>
                    <p>Professional PDF document with formatting</p>
                  </div>
                </div>
              </label>

              <label className={`format-option ${exportFormat === 'word' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value="word"
                  checked={exportFormat === 'word'}
                  onChange={(e) => setExportFormat(e.target.value)}
                />
                <div className="format-content">
                  <span className="format-icon">📝</span>
                  <div>
                    <strong>Word Document</strong>
                    <p>Editable Word document (.docx)</p>
                  </div>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card className="export-sections">
          <CardHeader>
            <h5>Include Sections</h5>
          </CardHeader>
          <CardContent>
            <div className="section-options">
              <label className="section-option">
                <input
                  type="checkbox"
                  checked={includeSections.summary}
                  onChange={() => handleSectionToggle('summary')}
                />
                <div className="section-content">
                  <strong>Document Summary</strong>
                  <p>Overview and key findings</p>
                </div>
              </label>

              <label className="section-option">
                <input
                  type="checkbox"
                  checked={includeSections.clauses}
                  onChange={() => handleSectionToggle('clauses')}
                />
                <div className="section-content">
                  <strong>Key Clauses</strong>
                  <p>Important clauses and explanations</p>
                </div>
              </label>

              <label className="section-option">
                <input
                  type="checkbox"
                  checked={includeSections.risks}
                  onChange={() => handleSectionToggle('risks')}
                />
                <div className="section-content">
                  <strong>Risk Assessment</strong>
                  <p>Potential risks and concerns</p>
                </div>
              </label>

              <label className="section-option">
                <input
                  type="checkbox"
                  checked={includeSections.qa}
                  onChange={() => handleSectionToggle('qa')}
                />
                <div className="section-content">
                  <strong>Q&A History</strong>
                  <p>Questions and answers from analysis</p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="export-actions">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={isExporting || !hasSelectedSections}
            loading={isExporting}
          >
            {isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportReport;
