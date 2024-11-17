import React from 'react';
import { Paper, Typography, Slider, TextField, Box, MenuItem } from '@mui/material';
import { GenerationConfig } from '../types/types';

interface Props {
  config: GenerationConfig;
  onChange: (key: keyof GenerationConfig, value: any) => void;
}

const ModelParameters: React.FC<Props> = ({ config, onChange }) => {
  // Define available models with descriptions(I highly highly recommend ONLY using gpt-4o-mini for now)
  const availableModels = [
    {
      value: 'gpt-4o-mini',
      label: 'GPT-4o-mini',
      description: 'Best for most sentiment tasks, very fast and cheap'
    },
    {
      value: 'gpt-4',
      label: 'GPT-4',
      description: 'Most capable model, best for very complex sentiment analysis, very expensive'
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
    },
    {
      value: 'gpt-3.5-turbo-16k',
      label: 'GPT-3.5 Turbo 16K',
      description: 'Extended context version, for larger batch processing'
    }
  ];

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Model Parameters
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" gutterBottom>
          Model Selection
        </Typography>
        <TextField
          select
          fullWidth
          value={config.model}
          onChange={(e) => onChange('model', e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          {availableModels.map((model) => (
            <MenuItem key={model.value} value={model.value}>
              <Box>
                <Typography variant="subtitle1">
                  {model.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {model.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Temperature
        </Typography>
        <Slider
          value={config.temperature}
          onChange={(_, value) => onChange('temperature', value)}
          min={0}
          max={2}
          step={0.1}
          marks
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Top P
        </Typography>
        <Slider
          value={config.topP}
          onChange={(_, value) => onChange('topP', value)}
          min={0}
          max={1}
          step={0.1}
          marks
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Max Tokens
        </Typography>
        <TextField
          type="number"
          value={config.maxTokens}
          onChange={(e) => onChange('maxTokens', parseInt(e.target.value))}
          fullWidth
          size="small"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Frequency Penalty
        </Typography>
        <Slider
          value={config.frequencyPenalty}
          onChange={(_, value) => onChange('frequencyPenalty', value)}
          min={-2}
          max={2}
          step={0.1}
          marks
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Presence Penalty
        </Typography>
        <Slider
          value={config.presencePenalty}
          onChange={(_, value) => onChange('presencePenalty', value)}
          min={-2}
          max={2}
          step={0.1}
          marks
          valueLabelDisplay="auto"
        />
      </Box>
    </>
  );
};

export default ModelParameters;