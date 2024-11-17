import React, { useState } from 'react';
import {
  Box,
  Slider,
  TextField,
  MenuItem,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import { GenerationConfig } from '../types/types';

interface Props {
  config: GenerationConfig;
  onChange: (key: keyof GenerationConfig, value: any) => void;
  onGenerate: (config: GenerationConfig) => Promise<void>;
  isLoading: boolean;
}

function GenerationForm({ config, onChange, onGenerate, isLoading }: Props) {
  const domains = ['all', 'business', 'technology', 'healthcare', 'education'];

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <form>
        <Typography variant="h6" gutterBottom>
          Sentiment Distribution
        </Typography>
        
        <Box sx={{ mb: 3 }}>
  <Typography>Positive: {config.sentimentDistribution.positive}%</Typography>
  <Slider
    value={config.sentimentDistribution.positive}
    onChange={(_, value) => {
      const newPositive = value as number;
      const remaining = 100 - newPositive;
      const ratio = config.sentimentDistribution.negative / 
        (config.sentimentDistribution.negative + config.sentimentDistribution.neutral);
      
      onChange('sentimentDistribution', {
        positive: newPositive,
        negative: Math.round(remaining * ratio),
        neutral: Math.round(remaining * (1 - ratio))
      });
    }}
    max={100}
  />
  
  <Typography>Negative: {config.sentimentDistribution.negative}%</Typography>
  <Slider
    value={config.sentimentDistribution.negative}
    onChange={(_, value) => {
      const newNegative = value as number;
      const remaining = 100 - config.sentimentDistribution.positive - newNegative;
      
      onChange('sentimentDistribution', {
        positive: config.sentimentDistribution.positive,
        negative: newNegative,
        neutral: remaining
      });
    }}
    max={100 - config.sentimentDistribution.positive}
  />
  
  <Typography>Neutral: {config.sentimentDistribution.neutral}%</Typography>
  <Typography variant="caption" color="text.secondary">
    (Automatically calculated from positive and negative values)
          </Typography>
        </Box>  

        <TextField
          fullWidth
          label="Number of Rows"
          type="number"
          value={config.rowCount}
          onChange={(e) => onChange('rowCount', Math.min(parseInt(e.target.value), 10000))}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          select
          label="Domain"
          value={config.domain}
          onChange={(e) => onChange('domain', e.target.value)}
          sx={{ mb: 2 }}
        >
          {domains.map((domain) => (
            <MenuItem key={domain} value={domain}>
              {domain.charAt(0).toUpperCase() + domain.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Temperature"
          type="number"
          value={config.temperature}
          onChange={(e) => onChange('temperature', parseFloat(e.target.value))}
          inputProps={{ step: 0.1, min: 0, max: 1 }}
          sx={{ mb: 2 }}
        />
      </form>
    </Paper>
  );
}

export default GenerationForm;