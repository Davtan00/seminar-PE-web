import React from 'react';
import { Paper, Typography, Box, Grid, Slider } from '@mui/material';
import { GenerationConfig } from '../types/types';

interface AdvancedParameterProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  description?: string;
}

const AdvancedParameter: React.FC<AdvancedParameterProps> = ({
  label,
  value,
  onChange,
  description
}) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="subtitle2">{label}</Typography>
    {description && (
      <Typography variant="caption" display="block" sx={{ mb: 1 }}>
        {description}
      </Typography>
    )}
    <Slider
      value={value}
      onChange={(_, newValue) => onChange(newValue as number)}
      min={0}
      max={1}
      step={0.1}
      marks
      valueLabelDisplay="auto"
    />
  </Box>
);

interface Props {
  config: GenerationConfig;
  onChange: (key: keyof GenerationConfig, value: number) => void;
}

const AdvancedParameters: React.FC<Props> = ({ config, onChange }) => {
  const parameters = [
    {
      key: 'privacyLevel',
      label: 'Privacy Level',
      description: 'Controls data privacy and synthetic generation'
    },
    {
      key: 'biasControl',
      label: 'Bias Control',
      description: 'Adjusts bias mitigation in generated content'
    },
    {
      key: 'sentimentIntensity',
      label: 'Sentiment Intensity',
      description: 'Controls strength of expressed sentiments'
    },
    {
      key: 'realism',
      label: 'Realism',
      description: 'Adjusts how realistic the generated content is'
    },
    {
      key: 'domainRelevance',
      label: 'Domain Relevance',
      description: 'Controls topic adherence'
    },
    {
      key: 'diversity',
      label: 'Diversity',
      description: 'Adjusts variety in generated content'
    },
    {
      key: 'temporalRelevance',
      label: 'Temporal Relevance',
      description: 'Controls time-specific content generation'
    },
    {
      key: 'noiseLevel',
      label: 'Noise Level',
      description: 'Adjusts data cleanliness and outliers'
    },
    {
      key: 'culturalSensitivity',
      label: 'Cultural Sensitivity',
      description: 'Controls cultural awareness in content'
    },
    {
      key: 'formality',
      label: 'Formality',
      description: 'Adjusts tone from casual to formal'
    },
    {
      key: 'lexicalComplexity',
      label: 'Lexical Complexity',
      description: 'Controls vocabulary complexity'
    }
  ];

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Advanced Parameters
      </Typography>
      <Box sx={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}>
        {parameters.map(({ key, label, description }) => (
          <AdvancedParameter
            key={key}
            label={label}
            value={config[key as keyof GenerationConfig] as number}
            onChange={(value) => onChange(key as keyof GenerationConfig, value)}
            description={description}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default AdvancedParameters; 