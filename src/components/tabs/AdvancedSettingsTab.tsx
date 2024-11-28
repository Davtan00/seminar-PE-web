import React from 'react';
import { Box, Typography, Slider, Paper } from '@mui/material';
import { GenerationConfig } from '../../types/types';

interface Props {
  config: GenerationConfig;
  onChange: (key: keyof GenerationConfig, value: any) => void;
  isLoading: boolean;
}

// Type guard to check if a value is a number(ts)
const isNumberValue = (key: keyof GenerationConfig): boolean => {
  const numericKeys = [
    'privacyLevel',
    'biasControl',
    'culturalSensitivity',
    'realism',
    'domainRelevance',
    'diversity',
    'temporalRelevance',
    'noiseLevel',
    'formality',
    'lexicalComplexity',
    'sentimentIntensity'
  ];
  return numericKeys.includes(key);
};

const sliderStyles = {
  '& .MuiSlider-thumb': {
    width: 12,
    height: 12,
    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0px 0px 0px 8px rgba(25, 118, 210, 0.16)',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.32,
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#1976d2',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
};

const AdvancedSettingsTab = ({ config, onChange, isLoading }: Props) => {
  const advancedParameters = [
    {
      group: 'Content Control',
      parameters: [
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
          key: 'culturalSensitivity',
          label: 'Cultural Sensitivity',
          description: 'Controls cultural awareness in content'
        }
      ]
    },
    {
      group: 'Generation Quality',
      parameters: [
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
        }
      ]
    },
    {
      group: 'Style Control',
      parameters: [
        {
          key: 'formality',
          label: 'Formality',
          description: 'Adjusts tone from casual to formal'
        },
        {
          key: 'lexicalComplexity',
          label: 'Lexical Complexity',
          description: 'Controls vocabulary complexity'
        },
        {
          key: 'sentimentIntensity',
          label: 'Sentiment Intensity',
          description: 'Controls strength of expressed sentiments'
        }
      ]
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {advancedParameters.map(({ group, parameters }) => (
        <Box key={group} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {group}
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: 4,
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {parameters.map(({ key, label, description }) => (
              <Box 
                key={key} 
                sx={{ 
                  mb: 2,
                  backgroundColor: 'background.paper',
                  padding: 2,
                  borderRadius: 1,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  '& .MuiSlider-root': {
                    width: '100%',
                  }
                }}
              >
                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {label}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: '0.875rem', minHeight: '2.5em' }}
                  >
                    {description}
                  </Typography>
                </Box>
                {isNumberValue(key as keyof GenerationConfig) && (
                  <Slider
                    value={config[key as keyof GenerationConfig] as number}
                    onChange={(_, value) => onChange(key as keyof GenerationConfig, value)}
                    min={0}
                    max={1}
                    step={0.1}
                    valueLabelDisplay="auto"
                    disabled={isLoading}
                    sx={sliderStyles}
                    marks={[
                      { value: 0, label: '0' },
                      { value: 0.5, label: '0.5' },
                      { value: 1, label: '1' },
                    ]}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default AdvancedSettingsTab; 