# ⚖️ Legal Document AI Assistant

A comprehensive full-stack application that revolutionizes legal document analysis through cutting-edge AI technology. Upload, analyze, compare, and export insights from legal documents with an intuitive, modern interface designed for legal professionals and businesses.

![Legal Document AI Assistant](https://img.shields.io/badge/Full--Stack-Application-blue) ![AI--Powered](https://img.shields.io/badge/AI--Powered-Google--Gemini-green) ![Modern--UI](https://img.shields.io/badge/UI-Glassmorphism-purple) ![Deployment--Ready](https://img.shields.io/badge/Deployment-Ready-orange)

## 🌟 What Makes This Special

### 🤖 **Advanced AI Analysis**
- **Google Gemini 2.0 Flash**: State-of-the-art AI for document understanding
- **Intelligent Extraction**: Automatically identifies key clauses, obligations, and risks
- **Contextual Summaries**: Human-like document summaries that capture essential information
- **Risk Assessment**: Proactive identification of potential legal liabilities and red flags

### 📊 **Smart Document Management**
- **Multi-Format Support**: PDF, Word (.doc/.docx), and plain text files
- **Bulk Operations**: Upload multiple documents and manage them efficiently
- **Search & Filter**: Quickly find documents with advanced search capabilities
- **Persistent Storage**: MongoDB integration for reliable document and analysis storage

### 🔄 **Document Comparison Engine**
- **Side-by-Side Analysis**: Compare two documents simultaneously
- **Difference Highlighting**: Visual indicators for additions, deletions, and modifications
- **Similarity Scoring**: Quantitative assessment of document similarity
- **Change Tracking**: Understand how documents evolve over time

### 📋 **Professional Export System**
- **Multiple Formats**: Export analysis as PDF reports or Word documents
- **Customizable Templates**: Choose which analysis sections to include
- **Branded Output**: Professional reports suitable for client presentations
- **Batch Export**: Generate reports for multiple documents at once

### 💬 **Interactive AI Chat**
- **Natural Language Queries**: Ask questions about your documents in plain English
- **Context-Aware Responses**: AI understands document context for accurate answers
- **Conversation History**: Maintain chat history for reference and follow-up questions
- **Source Citations**: Responses include references to specific document sections

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.8+** for backend
- **Node.js 16+** for frontend
- **MongoDB** (Atlas cloud or local instance)
- **Google Gemini API Key** (for AI analysis)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and database URL
```

**Required Environment Variables:**
```env
GEMINI_API_KEY=your_google_gemini_api_key
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=legal_docs
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Configure backend URL
echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env
```

### 3. Database Setup

**Option A: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Set up database user and whitelist IP
4. Get connection string and add to `.env`

**Option B: Local MongoDB**
```bash
# Install MongoDB locally
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongodb
```

### 4. Run the Application

```bash
# Terminal 1: Start Backend
cd backend
python server.py
# or
uvicorn server:app --host 0.0.0.0 --port 8000

# Terminal 2: Start Frontend
cd frontend
npm start
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs (FastAPI auto-generated)

## 🏗️ Technical Architecture

### Backend (FastAPI)
```
backend/
├── server.py              # Main FastAPI application
├── requirements.txt       # Python dependencies
├── test_*.py             # API endpoint tests
└── uploads/              # Temporary file storage
```

**Key Technologies:**
- **FastAPI**: High-performance async web framework
- **Motor**: Async MongoDB driver
- **PyPDF2**: PDF text extraction
- **Google Gemini API**: AI document analysis
- **Pydantic**: Data validation and serialization

### Frontend (React)
```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Design system components
│   │   ├── DocumentComparison.js
│   │   └── ExportReport.js
│   ├── App.js            # Main application component
│   └── index.js          # React entry point
├── public/               # Static assets
└── build/                # Production build output
```

**Key Technologies:**
- **React 18**: Modern React with concurrent features
- **Axios**: HTTP client for API communication
- **React Markdown**: Rich text rendering
- **Custom CSS**: Glassmorphism design system
- **Responsive Design**: Mobile-first approach

### Database Schema
```javascript
// Documents Collection
{
  _id: ObjectId,
  id: "unique-string-id",
  filename: "contract.pdf",
  file_path: "/uploads/contract.pdf",
  file_type: "application/pdf",
  upload_date: ISODate("2024-01-01T00:00:00Z"),
  analysis_status: "completed",
  summary: "Document summary text...",
  key_clauses: [
    {
      title: "Payment Terms",
      content: "Payment shall be made...",
      risk_level: "medium"
    }
  ],
  risk_assessment: "Overall risk assessment..."
}

// Chat Messages Collection
{
  _id: ObjectId,
  document_id: "doc-123",
  session_id: "session-456",
  timestamp: ISODate("2024-01-01T00:00:00Z"),
  question: "What are the payment terms?",
  answer: "According to section 3.2..."
}
```

## 📋 API Endpoints

### Document Management
- `POST /api/documents/upload` - Upload new document
- `GET /api/documents` - List all documents
- `GET /api/documents/{id}` - Get document details
- `DELETE /api/documents/{id}` - Delete document

### Document Analysis
- `POST /api/documents/{id}/analyze` - Trigger AI analysis
- `GET /api/documents/{id}/analysis` - Get analysis results

### Chat & Q&A
- `POST /api/documents/{id}/chat` - Ask questions about document
- `GET /api/documents/{id}/chat` - Get chat history

### Export & Reports
- `POST /api/documents/{id}/export` - Generate export report
- `GET /api/documents/{id}/export/{format}` - Download report

## 🚀 Deployment Options

### Railway (Easiest)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

### Docker Deployment
```dockerfile
# Dockerfile for backend
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Cloud Platforms
- **Vercel**: Frontend deployment with serverless functions
- **Render**: Full-stack deployment with persistent services
- **AWS**: EC2 + S3 + CloudFront for scalable deployment
- **Google Cloud**: App Engine + Cloud Storage + Firestore

## 🎯 Use Cases & Applications

### Legal Professionals
- **Contract Review**: Rapid analysis of complex agreements
- **Due Diligence**: Quick assessment of legal documents
- **Client Services**: Generate professional reports and summaries
- **Case Preparation**: Extract relevant clauses and evidence

### Corporate Legal Teams
- **Compliance Monitoring**: Ensure documents meet regulatory standards
- **Vendor Contracts**: Analyze supplier and partner agreements
- **Policy Documents**: Review internal policies and procedures
- **M&A Analysis**: Assess legal documents during mergers

### Small Businesses
- **Lease Agreements**: Understand commercial lease terms
- **Service Contracts**: Review vendor and client contracts
- **Employment Documents**: Analyze HR policies and contracts
- **Insurance Policies**: Understand coverage and exclusions

### Individuals
- **Consumer Contracts**: Analyze terms of service and user agreements
- **Real Estate**: Understand property purchase agreements
- **Financial Documents**: Review loan agreements and investment contracts
- **Privacy Policies**: Assess data handling and privacy terms

## 🔧 Configuration & Customization

### AI Model Settings
```python
# backend/server.py
GEMINI_MODEL = "gemini-2.0-flash-exp"
ANALYSIS_PROMPT = """
Analyze this legal document and provide:
1. Executive summary
2. Key clauses and obligations
3. Potential risks and concerns
4. Recommendations
"""
```

### UI Customization
```css
/* frontend/src/premium-styles.css */
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --glass-bg: rgba(255, 255, 255, 0.1);
  /* Customize colors, fonts, and spacing */
}
```

### File Upload Limits
```python
# backend/server.py
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx', '.txt'}
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest test_*.py -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

### API Testing
```bash
# Test document upload
curl -X POST "http://localhost:8000/api/documents/upload" \
  -F "file=@sample_contract.pdf"

# Test analysis
curl "http://localhost:8000/api/documents/{id}/analysis"
```

## 🤝 Contributing

We welcome contributions from developers, legal professionals, and AI enthusiasts!

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Standards
- **Backend**: Follow PEP 8, add type hints, write tests
- **Frontend**: Use functional components, follow React best practices
- **Documentation**: Update README for new features
- **Security**: Never commit API keys or sensitive data

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI** for the powerful Gemini API
- **FastAPI** team for the excellent web framework
- **React** community for the amazing frontend ecosystem
- **MongoDB** for reliable document database
- **Legal experts** who provided domain knowledge and validation

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)
- **Email**: support@legal-ai-assistant.com

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Basic document upload and AI analysis
- ✅ Document comparison functionality
- ✅ Export system for reports
- ✅ Modern glassmorphism UI

### Phase 2 (Upcoming)
- 🔄 **Multi-language Support**: Analyze documents in multiple languages
- 🔄 **Advanced AI Features**: Contract generation, clause suggestions
- 🔄 **Collaboration Tools**: Share documents and analyses with teams
- 🔄 **Integration APIs**: Connect with legal research databases

### Phase 3 (Future)
- 🔄 **Mobile App**: Native iOS and Android applications
- 🔄 **Blockchain Integration**: Smart contract analysis and generation
- 🔄 **Advanced Analytics**: Usage patterns and performance insights
- 🔄 **Enterprise Features**: SSO, audit logs, compliance reporting

---

**Built with ❤️ for the legal technology community**

*Empowering legal professionals with AI-driven document intelligence*
