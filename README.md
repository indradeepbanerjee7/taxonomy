
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
