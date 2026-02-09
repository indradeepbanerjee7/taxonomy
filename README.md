

# Executive Summary by Creator

## 1. Project Goal
**PowerTaxonomy** is an intelligent content optimization platform designed for modern e-commerce teams. It solves the problem of manual SKU auditing by using multimodal AI to benchmark product data against competitors and marketplace guidelines, ensuring compliance and maximizing search visibility.

## 2. What is the Tool Trying to Achieve?

### 🎥 Product Journey
  - **Setup**: Configuring the retailer (e.g., Amazon) and uploading raw CSV data + PDF guidelines.
  - **Analysis**: Selecting a target SKU and viewing the real-time competitive analysis (Rank, Content Depth, Visual score).
  - **Optimization**: The AI generating optimized Titles, Bullets, and Descriptions. This is inline with the Amazon Guidelines. The Product also highlights where-ever exitent details are out of policy and highlights them along with recommendations for improvement. 
  - **Export**: Downloading the final "production-ready" CSV row.
- **Reasoning**: Explains the architectural choice of using a client-side React app for speed and privacy, with a serverless-friendly AI integration.

### 💻 Source Code Repository
- **Tech Stack**: Built with **React**, **TypeScript**, and **Tailwind CSS** for a high-performance, responsive UI.
- **Key Components**:
  - `Step1Setup.tsx`: Robust CSV/PDF parsing engine with regex-based data normalization.
  - `Step2SelectSKU.tsx`: Advanced filtering logic (Brand, Universe, Neural Search).
  - `Step3Analysis.tsx`: The core engine visualizing competitive benchmarks and AI recommendations.
- **AI Integration**: Direct integration with Google Gemini Pro Vision for multimodal analysis (Text + Images).

### 📜 Prompts History (`PROMPTS.md`)
- A comprehensive log of the development process, documenting the iterative prompting strategy used to refine the UI, fix CSS issues, and implement complex logic like CSV parsing and error handling.

### 🧪 Evaluation Set (`sample_eval_set/`)
- **Purpose**: To allow immediate testing of the application without needing proprietary data.

### How is this Tool Beneficial in an Ecommerce Business Context 
- **Efficiency**: In Ecommerce Marketplaces one of the key challenges is sellers uploading Cataloging Content that is non standardized. This not only hurts their search potential, but also proves to be difficult to map to a knowledge graph/Vector DB for easy retrieval. Further, non standaridized Catalog has the added problem of using too much storage. Changing raw files for 100M SKUs manually is next to impossible and current Ecommerce Platforms depend on suppliers updating the doc, through inducements. However, leveraging an AI ensures that the whole work is automated, standardized and TAT becomes highly compressed.

 ### Further Improvements 
 - **Scale-Up**: This is a prototype tool that only updates the selected SKU. However to deploy this for a platform such as Amazon would need industrial grade servers, budget and parallel processing to batch process 1M SKU/hour. That is an engineering challenge that is out of scope for this Prototype. 

---

<div align="center">
  <img src="https://commerceiq.ai/wp-content/uploads/2023/06/CommerceIQ-Logo-1.png" alt="PowerTaxonomy Logo" width="200" />
  <h1>PowerTaxonomy Tool</h1>
  <p><strong>Advanced SKU Intelligence & Content Compliance Engine</strong></p>
</div>

## Overview
PowerTaxonomy is a cutting-edge tool designed to audit, benchmark, and optimize product content for major global retailers (Amazon, Walmart, Target, etc.). By leveraging multimodal AI, it compares your SKU against top competitors, identifies content gaps, and generates compliance-ready titles, bullets, and descriptions.

## Key Features

### 1. **Multi-Retailer Support**
   - **Company Theming**: Automatically adapts the UI (colors, fonts) based on the selected retailer (CommerceIQ, Walmart, Target, Amazon, Tesco).
   - **Guideline Integration**: Upload PDF guidelines to ensure all generated content adheres to specific marketplace rules.

### 2. **Intelligence Data Ingestion**
   - **CSV Upload**: Seamlessly import raw product data with automatic header mapping (smart detection of SKU, Title, Bullet Points, etc.).
   - **Data Cleansing**: robust handling of malformed CSVs and missing data points.

### 3. **Advanced Filtering & Selection**
   - **Smart Filters**: Drill down by Brand, Category (Universe), and Search/Category Ranks.
   - **Live Search**: Instantly find SKUs within the filtered dataset.

### 4. **AI-Powered Analysis**
   - **Competitive Benchmarking**: Visual charts comparing your SKU against the top 3 competitors on Title Length, Bullet Count, Description Depth, and Image Count.
   - **Compliance Audit**: Automated checks against marketplace guidelines with Pass/Fail/Warning status.
   - **Content Generation**: AI-suggested optimizations for Titles, Bullets, and Descriptions.

### 5. **Export & Review**
   - **Dual Views**: Switch between **Box View** (visual card with images) and **Table View** (classic data row) for the optimized record.
   - **CSV Export**: Download the single optimized SKU row in CSV format for direct integration into your PIM.
   - **PDF Report**: Generate a printable "Intelligence Report" for stakeholders.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- A valid Gemini API Key

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment:
   - Create a `.env.local` file.
   - Add your API key: `VITE_GEMINI_API_KEY=your_api_key_here`

### Running Locally
```bash
npm run dev
```
Open your browser to `http://localhost:5173` (or the port shown in the terminal).

## Usage Guide
1. **Setup**: select your target Retailer and upload your Product Data CSV and Guidelines PDF.
2. **Select**: Filter and choose the SKU you want to optimize.
3. **Analyze**: Review the AI analysis, authorize the changes, and export your optimized content.
