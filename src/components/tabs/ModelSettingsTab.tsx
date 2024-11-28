import React from 'react';
import { Box, Typography, TextField, Slider, MenuItem } from '@mui/material';
import { GenerationConfig } from '../../types/types';

interface Props {
  config: GenerationConfig;
  onChange: (key: keyof GenerationConfig, value: any) => void;
  isLoading: boolean;
}

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

const ModelSettingsTab = ({ config, onChange, isLoading }: Props) => {
  const availableModels = [
    {
      value: 'gpt-4o-mini',
      label: 'GPT-4o-mini',
      description: 'Best for our use case very fast and cheap'
    },
    {
      value: 'gpt-4',
      label: 'GPT-4',
      description: 'Most capable model, best for very complex sentiment analysis,EXPENSIVE'
    },
    {
      value: 'gpt-4-turbo',
      label: 'GPT-4 Turbo',
      description: 'Faster version of GPT-4, good balance of speed and quality'
    },
    {
      value: 'gpt-3.5-turbo',
      label: 'GPT-3.5 Turbo',
      description: 'Fast and cost-effective, good for most sentiment tasks'
    }
  ];

  const modelParameters = [
    {
      key: 'temperature',
      label: 'Temperature',
      description: 'Controls randomness in the output (0 = deterministic, 1 = very random)',
      min: 0,
      max: 1,
      step: 0.1
    },
    {
      key: 'topP',
      label: 'Top P',
      description: 'Controls diversity via nucleus sampling',
      min: 0,
      max: 1,
      step: 0.1
    },
    {
      key: 'frequencyPenalty',
      label: 'Frequency Penalty',
      description: 'Reduces repetition of token sequences',
      min: -2,
      max: 2,
      step: 0.1
    },
    {
      key: 'presencePenalty',
      label: 'Presence Penalty',
      description: 'Encourages the model to talk about new topics',
      min: -2,
      max: 2,
      step: 0.1
    }
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Model Selection
        </Typography>
        <TextField
          select
          fullWidth
          value={config.model}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('model', e.target.value)}
          variant="outlined"
          helperText="Select the AI model to use for generation"
        >
          {availableModels.map((model) => (
            <MenuItem key={model.value} value={model.value}>
              <Box>
                <Typography variant="subtitle2">{model.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {model.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Model Parameters
        </Typography>
        {modelParameters.map((param) => (
          <Box key={param.key} sx={{ mb: 3 }}>
            <Typography variant="subtitle2">{param.label}</Typography>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              {param.description}
            </Typography>
            <Slider
              value={config[param.key as keyof GenerationConfig] as number}
              onChange={(_: Event, value: number | number[]) => 
                onChange(param.key as keyof GenerationConfig, Array.isArray(value) ? value[0] : value)
              }
              min={param.min}
              max={param.max}
              step={param.step}
              marks
              valueLabelDisplay="auto"
              disabled={isLoading}
              sx={sliderStyles}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ModelSettingsTab; 