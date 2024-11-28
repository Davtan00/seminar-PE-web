import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { GenerationResponse } from '../types/types';

interface Props {
  data: GenerationResponse | null;
}

const DownloadButton = ({ data }: Props) => {
  const handleDownload = () => {
    if (!data) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-sentiments.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Tooltip title="Download JSON">
      <IconButton
        onClick={handleDownload}
        disabled={!data}
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
          '&.Mui-disabled': {
            backgroundColor: 'action.disabledBackground',
            color: 'action.disabled',
          }
        }}
      >
        <DownloadIcon />
      </IconButton>
    </Tooltip>
  );
};

export default DownloadButton;