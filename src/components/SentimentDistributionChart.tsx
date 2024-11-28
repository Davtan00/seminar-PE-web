import React from 'react';
import { Box, Typography } from '@mui/material';
import { GenerationConfig } from '../types/types';

interface Props {
  distribution: GenerationConfig['sentimentDistribution'];
}

const SentimentDistributionChart = ({ distribution }: Props) => {
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        height: '24px', 
        borderRadius: '12px',
        overflow: 'hidden',
        mb: 1
      }}>
        <Box 
          sx={{ 
            width: `${distribution.positive}%`,
            height: '24px',
            bgcolor: 'success.light',
            transition: 'width 0.3s ease'
          }} 
        />
        <Box 
          sx={{ 
            width: `${distribution.negative}%`,
            height: '24px',
            bgcolor: 'error.light',
            transition: 'width 0.3s ease'
          }} 
        />
        <Box 
          sx={{ 
            width: `${distribution.neutral}%`,
            height: '24px',
            bgcolor: 'grey.300',
            transition: 'width 0.3s ease'
          }} 
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="success.main">
          Positive: {distribution.positive}%
        </Typography>
        <Typography variant="caption" color="error.main">
          Negative: {distribution.negative}%
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Neutral: {distribution.neutral}%
        </Typography>
      </Box>
    </Box>
  );
};

export default SentimentDistributionChart; 