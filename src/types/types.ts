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
  }
  
  export interface GeneratedDataItem {
    id: number;
    text: string;
    sentiment: 'positive' | 'negative' | 'neutral';
  }
  
  export interface GenerationResponse {
    generated_data: GeneratedDataItem[];
  }