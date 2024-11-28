import React, { ReactElement } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  Paper,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { RequestHistoryItem } from '../../types/types';
import { AnalysisDownloadButton } from '../AnalysisDownloadButton';
import { decompressData } from '../../utils/secureApiClient';

interface Props {
  history: RequestHistoryItem[];
  onJsonDownload: (id: string) => void;
}

const RequestsHistoryTab = ({ history, onJsonDownload }: Props) => {
  const downloadJson = (data: any, name: string, timestamp: string, itemId?: string) => {
    const formattedTimestamp = timestamp.replace(/[/:]/g, '-');
    const filename = `${name}_${formattedTimestamp}.json`;
    
    const decompressedData = {
      ...data,
      generated_data: data.generated_data ? decompressData(data.generated_data) : []
    };
    
    const blob = new Blob([JSON.stringify(decompressedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (itemId) {
      onJsonDownload(itemId);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Generation History</Typography>
      <List>
        {history.map((item) => (
          <Paper 
            key={item.id} 
            sx={{ 
              mb: 2, 
              p: 2,
              borderLeft: 6,
              borderColor: item.status === 'processing' 
                ? 'warning.main'
                : item.status === 'success' 
                  ? 'success.main' 
                  : 'error.main'
            }}
          >
            <ListItem
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              disablePadding
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(item.timestamp).toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.isMockData && (
                    <Chip
                      label="TEST REQUEST"
                      color="info"
                      size="small"
                    />
                  )}
                  {item.status === 'processing' ? (
                    <Chip
                      label="Processing..."
                      color="warning"
                      size="small"
                    />
                  ) : item.status === 'error' ? (
                    <Chip
                      icon={<ErrorOutlineIcon />}
                      label="Error"
                      color="error"
                      size="small"
                    />
                  ) : (
                    <>
                      <Chip
                        label={`${item.response?.generated_data?.length || 0} Reviews`}
                        color="primary"
                        size="small"
                      />
                      <Chip
                        label={`${item.duration}ms`}
                        variant="outlined"
                        size="small"
                      />
                    </>
                  )}
                </Box>
              </Box>
              
              {item.status === 'error' && (
                <Typography 
                  color="error" 
                  sx={{ 
                    mt: 1, 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <ErrorOutlineIcon fontSize="small" />
                  Generation failed. Please try again.
                </Typography>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Tooltip title="Download Config">
                  <IconButton
                    onClick={() => downloadJson(
                      item.config, 
                      item.name || 'config',
                      new Date(item.timestamp).toISOString()
                    )}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
                {item.status === 'success' && item.response && (
                  <>
                    <Tooltip title="Download Generated Data">
                      <IconButton
                        onClick={() => downloadJson(
                          item.response,
                          item.name || 'generated-data',
                          new Date(item.timestamp).toISOString(),
                          item.id
                        )}
                        disabled={item.jsonDownloaded}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <AnalysisDownloadButton requestId={item.id} />
                  </>
                )}
              </Box>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default RequestsHistoryTab; 