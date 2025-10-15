import React, { useState, useEffect } from "react";
import "./App.css";
import "./enhanced-styles.css";
import "./improved-styles.css";
import "./premium-styles.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { ToastProvider, useToast } from "./components/ui/toast";
import Button from "./components/ui/button";
import Input from "./components/ui/input";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import { Loading } from "./components/ui/loading";
import Progress from "./components/ui/progress";
import DocumentComparison from "./components/DocumentComparison";
import ExportReport from "./components/ExportReport";
import RiskMeter from "./components/RiskMeter";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Document Upload Component
const DocumentUpload = ({ onUploadSuccess, onProgress, onToast }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
          onProgress?.(percentCompleted);
        },
      });

      setUploadProgress(100);
      onToast?.({
        title: "Upload Successful",
        description: `${file.name} has been uploaded successfully!`,
        variant: "success"
      });
      onUploadSuccess(response.data);
    } catch (error) {
      console.error('Upload failed:', error);
      onToast?.({
        title: "Upload Failed",
        description: "Please try again or check your file format.",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  return (
    <div className="upload-section">
      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''} ${isUploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="upload-progress">
            <Loading size="large" text={`Uploading document... ${uploadProgress}%`} />
            <Progress value={uploadProgress} showValue={true} />
          </div>
        ) : (
          <>
            <div className="upload-icon">Document Upload</div>
            <h3>Upload Legal Document</h3>
            <p>Drag and drop your document here, or click to browse</p>
            <p className="file-types">Supports PDF, Word, and Text files</p>
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt"
              className="file-input"
            />
          </>
        )}
      </div>
    </div>
  );
};

// Document Analysis Component
const DocumentAnalysis = ({ document, onBack }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [showExport, setShowExport] = useState(false);

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
  
  useEffect(() => {
    if (document.analysis_status === 'completed' && document.summary) {
      setAnalysis({
        summary: document.summary,
        key_clauses: document.key_clauses || [],
        risk_assessment: document.risk_assessment || ''
      });
    } else if (document.analysis_status === 'pending') {
      analyzeDocument();
    }
    
    loadChatHistory();
  }, [document]);
  
  const analyzeDocument = async () => {
    setIsAnalyzing(true);
    try {
      const response = await axios.post(`${API}/documents/${document.id}/analyze`);
      setAnalysis(response.data);
      setActiveTab('summary');
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`${API}/documents/${document.id}/chat`);
      setChatHistory(response.data);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };
  
  const askQuestion = async () => {
    if (!question.trim()) return;
    
    setIsAsking(true);
    try {
      const response = await axios.post(`${API}/documents/ask`, {
        document_id: document.id,
        question: question
      });
      
      setChatHistory(prev => [...prev, {
        question: question,
        answer: response.data.answer,
        timestamp: new Date().toISOString()
      }]);
      
      setQuestion('');
    } catch (error) {
      console.error('Question failed:', error);
      alert('Failed to ask question. Please try again.');
    } finally {
      setIsAsking(false);
    }
  };

  

  
  return (
    <div className="analysis-container">
      <div className="document-header">
        <button onClick={onBack} className="back-btn">← Back to Documents</button>
        <div className="document-info">
          <h2>{document.filename}</h2>
          <p className="upload-date">Uploaded: {new Date(document.upload_date).toLocaleDateString()}</p>
        </div>
        {analysis && (
          <div className="document-actions">
            <Button
              onClick={() => setShowExport(true)}
              variant="primary"
              size="small"
            >
              Export Report
            </Button>
          </div>
        )}
      </div>
      
      <div className="analysis-tabs">
        <button 
          className={`tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button 
          className={`tab ${activeTab === 'clauses' ? 'active' : ''}`}
          onClick={() => setActiveTab('clauses')}
        >
          Key Clauses
        </button>
        <button 
          className={`tab ${activeTab === 'risks' ? 'active' : ''}`}
          onClick={() => setActiveTab('risks')}
        >
          Risk Assessment
        </button>
        <button 
          className={`tab ${activeTab === 'qa' ? 'active' : ''}`}
          onClick={() => setActiveTab('qa')}
        >
          Ask Questions
        </button>
      </div>
      
      <div className="tab-content">
        {isAnalyzing ? (
          <div className="analyzing">
            <div className="spinner"></div>
            <h3>Analyzing document...</h3>
            <p>Our AI is reading through your document and preparing a comprehensive analysis.</p>
          </div>
        ) : analysis ? (
          <>
            {activeTab === 'summary' && (
              <div className="summary-section" style={{ marginBottom: '20px' }}>
                <div className="summary-content">
                  <ReactMarkdown components={{
                    h4: ({children}) => <div className="summary-subheader">{children}</div>,
                    p: ({children}) => <div className="summary-text">{children}</div>,
                    strong: ({children}) => <span className="highlight-text">{children}</span>
                  }}>{analysis.summary}</ReactMarkdown>
                </div>
              </div>
            )}
            
            {activeTab === 'clauses' && (
              <div className="clauses-section" style={{ marginBottom: '20px' }}>
                {analysis.key_clauses.length > 0 ? (
                  <div className="clauses-list">
                    {analysis.key_clauses.map((clause, index) => (
                      <div key={index} className="clause-item" style={{ marginBottom: '15px' }}>
                        <div className="clause-header">
                          <span className="clause-number">{index + 1}</span>
                          <h4>{clause.clause}</h4>
                        </div>
                        <div className="clause-content">
                          <ReactMarkdown components={{
                            p: ({children}) => <div className="clause-text">{children}</div>,
                            strong: ({children}) => <span className="clause-highlight">{children}</span>
                          }}>{clause.explanation}</ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="clause-extract">
                    <ReactMarkdown components={{
                      h4: ({children}) => <div className="clause-subheader">{children}</div>,
                      p: ({children}) => <div className="clause-text">{children}</div>,
                      strong: ({children}) => <span className="clause-highlight">{children}</span>
                    }}>
                      {analysis.summary.includes('## 🔑 KEY CLAUSES') ?
                        analysis.summary.split('## 🔑 KEY CLAUSES')[1].split('## ⚠️')[0] ||
                        analysis.summary.split('## 🔑 KEY CLAUSES')[1] : 'Key clauses information not available'}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'risks' && (
              <div className="risks-section" style={{ marginBottom: '20px' }}>
                <div className="risk-content">
                  <div className="risk-overview" style={{ marginBottom: '15px' }}>
                    <RiskMeter riskLevel={getRiskLevel()} />
                    <div className="risk-summary">
                      <div className="risk-level-indicator">
                        <span className={`risk-badge ${getRiskLevel()}`}>
                          {getRiskLevel().toUpperCase()} RISK
                        </span>
                      </div>
                      <p className="risk-description">
                        {getRiskLevel() === 'high' && 'This document contains significant risks that require immediate attention and legal review.'}
                        {getRiskLevel() === 'medium' && 'This document has moderate risks that should be carefully reviewed before proceeding.'}
                        {getRiskLevel() === 'low' && 'This document appears to have minimal risks, but standard due diligence is still recommended.'}
                      </p>
                    </div>
                  </div>
                  <div className="risk-details">
                    {analysis.risk_assessment ? (
                      <ReactMarkdown components={{
                        h4: ({children}) => <div className="risk-subheader">{children}</div>,
                        p: ({children}) => <div className="risk-text">{children}</div>,
                        strong: ({children}) => <span className="risk-highlight">{children}</span>,
                        ul: ({children}) => <div className="risk-list">{children}</div>,
                        li: ({children}) => <div className="risk-list-item">{children}</div>
                      }}>{analysis.risk_assessment}</ReactMarkdown>
                    ) : (
                      <div className="no-risks">
                        <div className="no-risks-icon">No Risks</div>
                        <p>No specific risks identified in this document.</p>
                        <span className="no-risks-note">However, we recommend consulting with legal professionals for comprehensive review.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'qa' && (
              <div className="qa-section" style={{ marginBottom: '20px' }}>
                

                <div className="question-input-container" style={{ marginBottom: '20px' }}>
                  <div className="question-input">
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Example: What are the payment terms? or What happens if we breach the contract?"
                      rows="3"
                    />
                    <button
                      onClick={askQuestion}
                      disabled={isAsking || !question.trim()}
                      className="ask-btn"
                    >
                      {isAsking ? (
                        <>
                          <div className="btn-spinner"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Ask AI
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="chat-history">
                  {chatHistory.length === 0 ? (
                    <div className="empty-chat">
                      <div className="empty-chat-icon">💭</div>
                      <h4>No questions asked yet</h4>
                      <p>Ask your first question to get started with AI-powered document analysis.</p>
                    </div>
                  ) : (
                    chatHistory.map((chat, index) => (
                      <div key={index} className="chat-item" style={{ marginBottom: '15px' }}>
                      <div className="question-bubble">
                        <div className="question-header">
                          <span className="question-icon">Question</span>
                          <span className="question-label">Your Question</span>
                        </div>
                          <div className="question-text">{chat.question}</div>
                        </div>
                        <div className="answer-bubble">
                          <div className="answer-header">
                            <span className="answer-icon">AI</span>
                            <span className="answer-label">AI Analysis</span>
                          </div>
                          <div className="answer-content">
                            <ReactMarkdown components={{
                              p: ({children}) => <div className="answer-text">{children}</div>,
                              strong: ({children}) => <span className="answer-highlight">{children}</span>,
                              ul: ({children}) => <div className="answer-list">{children}</div>,
                              li: ({children}) => <div className="answer-list-item">{children}</div>
                            }}>{chat.answer}</ReactMarkdown>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {chatHistory.length > 0 && (
                  <div className="export-section" style={{ marginTop: '20px' }}>
                    <div className="export-info">
                      <span className="export-icon">📄</span>
                      <span>Export this Q&A session for your records</span>
                    </div>
                    <button
                      onClick={() => {
                        // Create export data for Q&A
                        const exportData = {
                          document_id: document.id,
                          format: 'pdf',
                          sections: { qa: true }
                        };
                        // Trigger export
                        axios.post(`${API}/documents/${document.id}/export`, exportData, {
                          responseType: 'blob'
                        }).then(response => {
                          const url = window.URL.createObjectURL(new Blob([response.data]));
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', `${document.filename.replace(/\.[^/.]+$/, '')}_qa_export.pdf`);
                          document.body.appendChild(link);
                          link.click();
                          link.remove();
                          window.URL.revokeObjectURL(url);
                        }).catch(error => {
                          console.error('Export failed:', error);
                          alert('Export failed. Please try again.');
                        });
                      }}
                      className="export-btn"
                    >
                      📄 Export Q&A Session
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="no-analysis">
            <p>No analysis available. Please try analyzing the document again.</p>
            <button onClick={analyzeDocument} className="analyze-btn">Analyze Document</button>
          </div>
        )}
      </div>

      <ExportReport
        isOpen={showExport}
        onClose={() => setShowExport(false)}
        document={document}
        analysis={analysis}
      />
    </div>
  );
};

// Documents Dashboard Component
const DocumentsDashboard = ({
  documents,
  onSelectDocument,
  onUploadNew,
  onDeleteDocument,
  onCompareDocuments,
  onExportReport,
  isDarkMode
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectMode, setSelectMode] = React.useState(false);
  const [selectedDocuments, setSelectedDocuments] = React.useState([]);
  const [showComparison, setShowComparison] = React.useState(false);
  const [showExport, setShowExport] = React.useState(false);
  const [exportDocument, setExportDocument] = React.useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'processing': return 'orange';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDocumentClick = (doc) => {
    if (selectMode) {
      if (selectedDocuments.includes(doc.id)) {
        setSelectedDocuments(selectedDocuments.filter(id => id !== doc.id));
      } else {
        setSelectedDocuments([...selectedDocuments, doc.id]);
      }
    } else {
      onSelectDocument(doc);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedDocuments.length > 0) {
      if (window.confirm(`Are you sure you want to delete ${selectedDocuments.length} selected document(s)?`)) {
        selectedDocuments.forEach(id => onDeleteDocument(id, null, true));
        setSelectedDocuments([]);
        setSelectMode(false);
      }
    }
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    setSelectedDocuments([]);
  };

  const handleCompareClick = () => {
    setShowComparison(true);
  };

  const handleExportClick = (doc) => {
    setExportDocument(doc);
    setShowExport(true);
  };

  return (
    <>
      <div className="dashboard">
        <div className="dashboard-header" style={{ position: 'relative' }}>
          <h2>Your Legal Documents</h2>
          <div className="dashboard-actions">
            <Input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <Button onClick={onUploadNew} className="upload-new-btn">
              Upload New
            </Button>
            <Button onClick={handleCompareClick} variant="secondary">
              Compare Docs
            </Button>
            <Button onClick={toggleSelectMode} variant="outline">
              {selectMode ? 'Cancel Select' : 'Select to Delete'}
            </Button>
            {selectMode && (
              <Button
                onClick={handleDeleteSelected}
                variant="danger"
                disabled={selectedDocuments.length === 0}
              >
                Delete Selected ({selectedDocuments.length})
              </Button>
            )}
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No documents yet</h3>
            <p>Upload your first legal document to get started with AI analysis</p>
            <Button onClick={onUploadNew} className="primary-btn">
              Upload Document
            </Button>
          </div>
        ) : (
          <div className="documents-grid">
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className={`document-card ${selectMode && selectedDocuments.includes(doc.id) ? 'selected' : ''}`}
                onClick={() => handleDocumentClick(doc)}
              >
                <CardContent>
                  {selectMode && (
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(doc.id)}
                      onChange={() => handleDocumentClick(doc)}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        zIndex: 10,
                        transform: 'scale(1.5)'
                      }}
                    />
                  )}
                  <div className="document-icon">📄</div>
                  <div className="document-info" title={doc.filename}>
                    <h4>{doc.filename}</h4>
                    <div className={`status ${getStatusColor(doc.analysis_status)}`}>
                      {doc.analysis_status} - {new Date(doc.upload_date).toLocaleDateString()}
                    </div>
                  </div>
                  {!selectMode && doc.analysis_status === 'completed' && (
                    <div className="document-actions">
                      <Button
                        size="small"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportClick(doc);
                        }}
                      >
                        Export
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <DocumentComparison
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
        documents={documents}
      />

      {exportDocument && (
        <ExportReport
          isOpen={showExport}
          onClose={() => {
            setShowExport(false);
            setExportDocument(null);
          }}
          document={exportDocument}
          analysis={exportDocument ? {
            summary: exportDocument.summary,
            key_clauses: exportDocument.key_clauses || [],
            risk_assessment: exportDocument.risk_assessment || ''
          } : null}
        />
      )}
    </>
  );
};

// Theme Context
const ThemeContext = React.createContext();

// Main App Component
function App() {
  const [currentView, setCurrentView] = useState('upload'); // upload, dashboard, analysis
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  useEffect(() => {
    loadDocuments();
  }, []);
  
  const loadDocuments = async () => {
    try {
      const response = await axios.get(`${API}/documents`);
      setDocuments(response.data);
      
      // If we have documents, show dashboard, otherwise show upload
      if (response.data.length > 0) {
        setCurrentView('dashboard');
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId, event, bulk = false) => {
    if (!bulk) {
      event.stopPropagation(); // Prevent document selection when clicking delete
    }
    if (bulk || window.confirm('Are you sure you want to delete this document?')) {
      try {
        const response = await axios({
          method: 'DELETE',
          url: `${API}/documents/${documentId}`,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.data && response.data.message === "Document deleted successfully") {
          if (!bulk) {
            alert('Document deleted successfully!');
          }
          loadDocuments(); // Refresh the documents list
        } else {
          throw new Error('Unexpected response from server');
        }
      } catch (error) {
        console.error('Delete error details:', {
          error: error,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        });
        if (!bulk) {
          alert('Failed to delete document. Please try again. Error: ' +
            (error.response?.data?.detail || error.message) +
            '\nStatus: ' + error.response?.status
          );
        }
      }
    }
  };
  
  const handleUploadSuccess = (uploadData) => {
    loadDocuments();
    setCurrentView('dashboard');
  };
  
  const handleSelectDocument = (document) => {
    setSelectedDocument(document);
    setCurrentView('analysis');
  };
  
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedDocument(null);
    loadDocuments(); // Refresh documents
  };
  
  const handleUploadNew = () => {
    setCurrentView('upload');
  };
  
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <h2>Loading Legal Document AI...</h2>
      </div>
    );
  }
  
  return (
    <ToastProvider>
      <div className={`App ${isDarkMode ? 'dark' : ''}`}>
        <header className="app-header">
          <div className="header-content">
            <h1>Legal Document AI Assistant</h1>
            <p>Simplify complex legal documents with AI-powered analysis</p>
          </div>
          <Button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="dark-mode-toggle"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            size="small"
            variant="ghost"
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              fontSize: '20px',
              zIndex: 10,
            }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </Button>
        </header>

        <main className="main-content">
          {currentView === 'upload' && (
            <DocumentUpload onUploadSuccess={handleUploadSuccess} />
          )}

          {currentView === 'dashboard' && (
            <DocumentsDashboard
              documents={documents}
              onSelectDocument={handleSelectDocument}
              onUploadNew={handleUploadNew}
              onDeleteDocument={handleDeleteDocument}
              onCompareDocuments={() => {}}
              onExportReport={() => {}}
              isDarkMode={isDarkMode}
            />
          )}

          {currentView === 'analysis' && selectedDocument && (
            <DocumentAnalysis
              document={selectedDocument}
              onBack={handleBackToDashboard}
            />
          )}
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;