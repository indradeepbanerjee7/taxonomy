
export interface ProductData {
  sku_id: string;
  title: string;
  universe: string;
  image_url: string;
  bullets: string;
  min_rank_search: string;
  avg_rank_search: string;
  min_rank_category: string;
  avg_rank_category: string;
  retailer_category_node: string;
  retailer_brand_name: string;
  description_filled: string;
}

export interface CompanyTheme {
  name: string;
  primary: string;
  secondary: string;
  font: string;
  logoColor: string;
}

export interface AnalysisResult {
  score: number;
  comparison: {
    metric: string;
    skuValue: number;
    competitorAvg: number;
    recommendation: string;
  }[];
  topEdits: {
    title: string;
    bullets: string;
    description: string;
    rulesLink: string;
    competitorRef: string;
  };
  complianceCheck: {
    status: 'pass' | 'fail' | 'warning';
    issue: string;
  }[];
}

export enum AppStep {
  SETUP = 'SETUP',
  SELECTION = 'SELECTION',
  ANALYSIS = 'ANALYSIS'
}

export interface SKUFilters {
  brand: string;
  universe: string;
  minSearchRank: string;
  maxSearchRank: string;
}
