# ⚖️ Legal Document AI Assistant

A modern, AI-powered web application that simplifies complex legal documents through intelligent analysis, comparison, and export capabilities. Built with React and designed for legal professionals, businesses, and anyone dealing with legal documentation.

![Legal Document AI Assistant](https://img.shields.io/badge/React-18.2.0-blue) ![AI--Powered](https://img.shields.io/badge/AI--Powered-OpenAI-green) ![Modern--UI](https://img.shields.io/badge/UI-Modern-purple)

## ✨ Features

### 🔍 **Intelligent Document Analysis**
- **AI-Powered Analysis**: Leverages advanced AI to extract key clauses, identify risks, and provide comprehensive summaries
- **Multi-Format Support**: Supports PDF, Word documents, and text files
- **Real-time Processing**: Instant analysis with progress tracking and status updates

### 📊 **Document Comparison**
- **Side-by-Side Analysis**: Compare two legal documents simultaneously
- **Similarity Detection**: Identify common clauses and differences
- **Smart Recommendations**: Get AI-generated insights on document variations

### 📤 **Export & Reporting**
- **Multiple Formats**: Export analysis reports as PDF or Word documents
- **Customizable Sections**: Choose which parts of the analysis to include
- **Professional Output**: Generate polished reports for client presentations

### 🎨 **Modern User Experience**
- **Glassmorphism Design**: Beautiful, modern UI with backdrop blur effects
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Intuitive Navigation**: Clean, professional interface designed for efficiency

### 💬 **Interactive Q&A**
- **Ask Questions**: Query your documents in natural language
- **Contextual Answers**: Get specific answers about clauses, terms, and conditions
- **Chat History**: Maintain conversation history for reference

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API server running

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd legal-ai-assistant/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Copy the environment file
   cp .env.example .env

   # Edit .env with your backend URL
   REACT_APP_BACKEND_URL=http://localhost:8000
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder, ready for deployment to services like Railway, Vercel, or Netlify.

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Modern React with hooks and concurrent features
- **Custom UI Components** - Reusable component library with consistent design
- **Axios** - HTTP client for API communication
- **React Markdown** - Rich text rendering for analysis results
- **CSS-in-JS** - Modern styling with CSS variables and utilities

### Key Components
- **DocumentUpload** - Drag-and-drop file upload with progress tracking
- **DocumentsDashboard** - Document management with search and bulk operations
- **DocumentAnalysis** - Detailed analysis view with tabbed interface
- **DocumentComparison** - Side-by-side document comparison
- **ExportReport** - Report generation and download functionality

### Design System
- **Glassmorphism Effects** - Modern backdrop blur and transparency
- **Gradient Themes** - Professional color schemes with accessibility
- **Responsive Grid** - Mobile-first responsive design
- **Animation Library** - Smooth transitions and micro-interactions

## 📱 Usage Guide

### 1. Upload Documents
- Drag and drop legal documents or click to browse
- Supports PDF, DOC, DOCX, and TXT formats
- Real-time upload progress with visual feedback

### 2. View Analysis
- Automatic AI analysis upon upload
- Navigate through Summary, Key Clauses, Risk Assessment, and Q&A tabs
- Interactive document exploration

### 3. Compare Documents
- Select two documents from your dashboard
- AI-powered comparison highlighting similarities and differences
- Export comparison results

### 4. Export Reports
- Choose export format (PDF or Word)
- Select analysis sections to include
- Download professional reports instantly

### 5. Ask Questions
- Natural language queries about your documents
- Contextual answers with source references
- Conversation history preservation

## 🎯 Use Cases

### For Legal Professionals
- **Contract Review**: Quickly identify key terms and potential risks
- **Document Comparison**: Compare contract versions or similar agreements
- **Client Reports**: Generate professional analysis reports

### For Businesses
- **Compliance Checking**: Ensure documents meet regulatory requirements
- **Risk Assessment**: Identify potential legal liabilities
- **Document Management**: Organize and analyze legal document collections

### For Individuals
- **Lease Agreements**: Understand rental terms and obligations
- **Service Contracts**: Review terms of service and user agreements
- **Legal Documents**: Make informed decisions about legal matters

## 🔧 Configuration

### Environment Variables
```env
REACT_APP_BACKEND_URL=http://localhost:8000  # Backend API URL
```

### Build Configuration
The project uses CRACO (Create React App Configuration Override) for advanced build customization:
- Tailwind CSS integration
- Custom webpack configuration
- PostCSS processing

## 🚀 Deployment

### Railway (Recommended)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Configure environment variables
5. Deploy!

### Other Platforms
The built application is compatible with:
- **Vercel**: `npm run build` with `build` directory
- **Netlify**: `npm run build` with `build` directory
- **AWS S3 + CloudFront**: Static hosting setup
- **Docker**: Containerized deployment

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and hooks patterns
- Maintain component consistency with the design system
- Add proper TypeScript types (when applicable)
- Test components across different screen sizes
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for powering the AI analysis capabilities
- **React Community** for the amazing ecosystem
- **Design Inspiration** from modern web design trends
- **Legal Professionals** who provided domain expertise

## 📞 Support

For support, questions, or feature requests:
- Create an issue on GitHub
- Contact the development team
- Check the documentation for common solutions

---

**Made with ❤️ for legal professionals and document analysis enthusiasts**

*Transforming complex legal documents into clear, actionable insights*
