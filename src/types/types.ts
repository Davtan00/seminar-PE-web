export interface GenerationConfig {
    sentimentDistribution: {
      positive: number;
      negative: number;
      neutral: number;
    };
    rowCount: number;
    domain: string;
    temperature: number;
    topP: number;
    maxTokens: number;
    frequencyPenalty: number;
    presencePenalty: number;
    model: string;
    privacyLevel: number;
    biasControl: number;
    sentimentIntensity: number;
    realism: number;
    domainRelevance: number;
    diversity: number;
    temporalRelevance: number;
    noiseLevel: number;
    culturalSensitivity: number;
    formality: number;
    lexicalComplexity: number;
    strictMode: boolean;
  }
  
  export interface GeneratedDataItem {
    id: number;
    text: string;
    sentiment: 'positive' | 'negative' | 'neutral';
  }
  
  export interface GenerationResponse {
    request_id: string;
    generated_data: GeneratedDataItem[];
    summary: {
      total_generated: number;
      sentiment_distribution: {
        positive: number;
        negative: number;
        neutral: number;
      }
    }
  }
  
  export interface TabProps {
    config: GenerationConfig;
    onChange: (key: keyof GenerationConfig, value: any) => void;
    isLoading: boolean;
  }
  
  export interface RequestHistoryItem {
    id: string;
    timestamp: Date;
    duration: number;
    config: GenerationConfig;
    response: GenerationResponse | null;
    responseSize?: number;
    status: 'success' | 'error' | 'processing';
    isMockData?: boolean;
    downloaded?: boolean;
    name: string;
    jsonDownloaded?: boolean;
    pdfDownloaded?: boolean;
    data?: {
      duration: number;
     
    };
  }