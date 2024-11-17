import React from 'react';
import { Box, Grid } from '@mui/material';
import { GenerationConfig } from '../types/types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={3} sx={{ height: '100%', overflowY: 'auto' }}>
          <Box sx={{ p: 2 }}>
          </Box>
        </Grid>

        <Grid item xs={6} sx={{ height: '100%', overflowY: 'auto' }}>
          <Box sx={{ p: 2 }}>
            {children}
          </Box>
        </Grid>

        <Grid item xs={3} sx={{ height: '100%', overflowY: 'auto' }}>
          <Box sx={{ p: 2 }}>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout; 