import React from 'react';
import { 
  Box, 
  Button, 
  ButtonGroup, 
  Typography,
  Tooltip,
  IconButton
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SaveIcon from '@mui/icons-material/Save';
import { GenerationConfig, GenerationResponse } from '../types/types';
import { exportConfiguration, generateData } from '../services/configurationService';

interface Props {
  config: GenerationConfig;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ConfigurationControls: React.FC<Props> = ({ 
  config,
  onGenerate, 
  isGenerating 
}) => {
  const handleExportConfig = () => {
    const configJson = JSON.stringify(config, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentiment-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      left: '24px', 
      bottom: '24px', 
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      <ButtonGroup variant="contained" orientation="vertical">
        <Button
          startIcon={<PlayArrowIcon />}
          onClick={onGenerate}
          disabled={isGenerating}
          color="primary"
          sx={{ width: '200px' }}
        >
          {isGenerating ? 'Generating...' : 'Generate Data'}
        </Button>
        
        <Tooltip title="Export Configuration">
          <Button
            startIcon={<SaveIcon />}
            onClick={handleExportConfig}
            color="secondary"
          >
            Export Config
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Box>
  );
};

export default ConfigurationControls; 