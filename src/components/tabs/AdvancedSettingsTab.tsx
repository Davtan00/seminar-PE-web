import React from 'react';
import { Box, Typography, Slider, Paper } from '@mui/material';
import { GenerationConfig } from '../../types/types';

interface Props {
  config: GenerationConfig;
  onChange: (key: keyof GenerationConfig, value: any) => void;
  isLoading: boolean;
}

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
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {advancedParameters.map((group) => (
        <Paper key={group.group} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            {group.group}
          </Typography>
          
          {group.parameters.map((param) => (
            <Box key={param.key} sx={{ mb: 3 }}>
              <Typography variant="subtitle2">
                {param.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                {param.description}
              </Typography>
              <Slider
                value={config[param.key as keyof GenerationConfig] as number}
                onChange={(_: Event, value: number | number[], activeThumb: number) => 
                  onChange(param.key as keyof GenerationConfig, Array.isArray(value) ? value[0] : value)
                }
                min={0}
                max={1}
                step={0.1}
              />
            </Box>
          ))}
        </Paper>
      ))}
    </Box>
  );
};

export default AdvancedSettingsTab; 