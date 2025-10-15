import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './ui/modal';
import Button from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Loading } from './ui/loading';
import { useToast } from './ui/toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DocumentComparison = ({ isOpen, onClose, documents }) => {
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [activeView, setActiveView] = useState('selection');
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setSelectedDocs([]);
      setComparison(null);
      setActiveView('selection');
    }
  }, [isOpen]);

  const handleDocSelect = (docId) => {
    setSelectedDocs(prev => {
      if (prev.includes(docId)) {
        return prev.filter(id => id !== docId);
      } else if (prev.length < 2) {
        return [...prev, docId];
      }
      return prev;
    });
  };

  const startComparison = async () => {
    if (selectedDocs.length !== 2) return;

    setIsComparing(true);
    try {
      const response = await axios.post(`${API}/documents/compare`, {
        document_ids: selectedDocs
      });

      setComparison(response.data);
      setActiveView('results');
      toast({
        title: "Comparison Complete",
        description: "Documents have been successfully compared.",
        variant: "success"
      });
    } catch (error) {
      console.error('Comparison failed:', error);
      toast({
        title: "Comparison Failed",
        description: "Please try again or check your documents.",
        variant: "destructive"
      });
    } finally {
      setIsComparing(false);
    }
  };

  const renderDocSelection = () => (
    <div className="comparison-selection">
      <div className="selection-header">
        <h3>Select Two Documents to Compare</h3>
        <p>Choose documents to analyze similarities, differences, and key distinctions.</p>
      </div>

      <div className="documents-grid">
        {documents.map(doc => (
          <Card
            key={doc.id}
            className={`comparison-doc-card ${selectedDocs.includes(doc.id) ? 'selected' : ''}`}
            onClick={() => handleDocSelect(doc.id)}
          >
            <CardContent>
              <div className="doc-icon">📄</div>
              <h4>{doc.filename}</h4>
              <p className="doc-date">
                {new Date(doc.upload_date).toLocaleDateString()}
              </p>
              <div className={`selection-indicator ${selectedDocs.includes(doc.id) ? 'active' : ''}`}>
                {selectedDocs.includes(doc.id) && (
                  <span>{selectedDocs.indexOf(doc.id) + 1}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="comparison-actions">
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={startComparison}
          disabled={selectedDocs.length !== 2 || isComparing}
          loading={isComparing}
        >
          {isComparing ? 'Comparing...' : 'Compare Documents'}
        </Button>
      </div>
    </div>
  );

  const renderComparisonResults = () => {
    if (!comparison) return null;

    const doc1 = documents.find(d => d.id === selectedDocs[0]);
    const doc2 = documents.find(d => d.id === selectedDocs[1]);

    return (
      <div className="comparison-results">
        <div className="results-header">
          <h3>Document Comparison Results</h3>
          <div className="compared-docs">
            <span className="doc-label doc1">{doc1?.filename}</span>
            <span className="vs">vs</span>
            <span className="doc-label doc2">{doc2?.filename}</span>
          </div>
        </div>

        <div className="comparison-content">
          <Card className="similarities-section">
            <CardHeader>
              <h4>🔍 Similarities</h4>
            </CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: comparison.similarities || 'No significant similarities found.' }} />
            </CardContent>
          </Card>

          <Card className="differences-section">
            <CardHeader>
              <h4>⚖️ Key Differences</h4>
            </CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: comparison.differences || 'No significant differences found.' }} />
            </CardContent>
          </Card>

          <Card className="recommendations-section">
            <CardHeader>
              <h4>💡 Recommendations</h4>
            </CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: comparison.recommendations || 'No specific recommendations available.' }} />
            </CardContent>
          </Card>
        </div>

        <div className="comparison-actions">
          <Button
            variant="secondary"
            onClick={() => setActiveView('selection')}
          >
            Compare Different Docs
          </Button>
          <Button
            variant="primary"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Document Comparison"
      size="large"
    >
      {isComparing ? (
        <div className="comparison-loading">
          <Loading size="large" text="Analyzing documents and generating comparison..." />
        </div>
      ) : activeView === 'selection' ? (
        renderDocSelection()
      ) : (
        renderComparisonResults()
      )}
    </Modal>
  );
};

export default DocumentComparison;
