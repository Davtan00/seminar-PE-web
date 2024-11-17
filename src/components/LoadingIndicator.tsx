import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

interface LoadingIndicatorProps {
  open: boolean;
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  open, 
  message = 'Generating data...' 
}) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body1">
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default LoadingIndicator;
