import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { GenerationConfig } from '../types/types';

interface ConfigPanelProps {
  config: GenerationConfig;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config }) => {
  const total = Object.values(config.sentimentDistribution).reduce((a, b) => a + b, 0);
  
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Current Configuration
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Typography variant="body2">
          Positive: {config.sentimentDistribution.positive}%
        </Typography>
        <Typography variant="body2">
          Negative: {config.sentimentDistribution.negative}%
        </Typography>
        <Typography variant="body2">
          Neutral: {config.sentimentDistribution.neutral}%
        </Typography>
        <Typography variant="body2" color={total !== 100 ? 'error' : 'inherit'}>
          Total: {total}%
        </Typography>
        
        <Typography variant="body2">
          Row Count: {config.rowCount}
        </Typography>
        <Typography variant="body2">
          Domain: {config.domain}
        </Typography>
        <Typography variant="body2">
          Temperature: {config.temperature}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ConfigPanel;