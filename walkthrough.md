# PowerTaxonomy Application Walkthrough

## Overview
**PowerTaxonomy** is an advanced taxonomy intelligence engine designed to benchmark product content against competitors using multimodal AI. It ensures compliance with global marketplace guidelines and generates optimized, high-converting content.

---

## Workflow Steps

### Step 1: System Initialization & Ingestion
The entry point for configuring the analysis environment.

1.  **Select Retail Protocol**
    -   Choose the target marketplace (e.g., `AMAZON`, `WALMART`) from the dropdown menu.
    -   *Impact:* This dynamically adjusts the system's branding colors, fonts, and specific compliance rules for the analysis.

2.  **Load Product Catalog (CSV)**
    -   Upload your raw product data file.
    -   *Logic:* The system automatically normalizes header names (e.g., mapping "Product ID" to `sku_id`) and validates the structure.

3.  **Load Guidelines (PDF/TXT)**
    -   Upload the official compliance document for the category or retailer.
    -   *Logic:* The AI reads both text and images (if PDF) to understand specific constraints like "No promotional phrases" or "Main image must have white background".

4.  **Execute Intelligence Scan**
    -   Click the button to process files and move to the catalog view.

---

### Step 2: Catalog Scan & Selection
A dashboard to browse and filter the ingested product universe.

1.  **Dashboard Metrics**
    -   View the total count of indexed units and detected product universes (categories).

2.  **Neural Search & Filters**
    -   **Search**: Type keywords, SKU IDs, or titles to filter results instantly.
    -   **Brand Origin**: Filter by specific brands found in the CSV.
    -   **Target Universe**: Filter by product category (e.g., "Electronics", "Home").

3.  **Select SKU**
    -   Review the table showing `Telemetry ID`, `Product Asset Descriptor` (Title), and `Avg Rank`.
    -   Click **"PROCESS"** on a specific row to initiate the deep analysis for that product.

---

### Step 3: Intelligence Report & Optimization
The core analysis interface where AI generates insights and content.

1.  **Readiness Core**
    -   **Efficiency Score**: A standard 0-100 score indicating how well the SKU meets standards.
    -   **Status**: Classifications like "Market Titan" (High score) or "Signal Drift" (Low score).

2.  **Market Matrix Benchmark**
    -   A visual bar chart comparing your SKU's key metrics (Title Length, Bullet Count, Description Length, etc.) against the **Competitor Average** and **Guideline Standards**.

3.  **Neural Content Recommendations**
    -   Generates three key optimized assets:
        -   **Prime Title SEO**: Keyword-optimized title.
        -   **Conversion Bullets**: Enhanced feature bullets focused on benefits.
        -   **Deep Description**: Rich, engaging product description.

4.  **Compliance Integrity Audit**
    -   A grid of checks (Pass/Fail) against the uploaded guidelines.
    -   *Example:* "Title length < 200 chars: PASS", "No prohibited words: FAIL".

5.  **Authorize & Export**
    -   Click **"Authorize Asset Generation"** to finalize the recommended changes.
    -   **View Modes**: Toggle between "Box View" (Visual card with images) and "Table View" (Data grid).
    -   **Download CSV**: Export the single optimized row, ready for upload to the retailer portal.
    -   **Markdown Summary**: Copy a formatted text report of the changes.
