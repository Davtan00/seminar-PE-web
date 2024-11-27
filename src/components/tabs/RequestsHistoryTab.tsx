import React from 'react';
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
import { RequestHistoryItem } from '../../types/types';
import { AnalysisDownloadButton } from '../AnalysisDownloadButton';

interface Props {
  history: RequestHistoryItem[];
  onJsonDownload: (itemId: string) => void;
}

const RequestsHistoryTab: React.FC<Props> = ({ history, onJsonDownload }) => {
  const downloadJson = (data: any, name: string, timestamp: string, itemId?: string) => {
    const formattedTimestamp = timestamp.replace(/[/:]/g, '-');
    const filename = `${name}_${formattedTimestamp}.json`;
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
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
              borderColor: item.status === 'success' ? 'success.main' : 'error.main'
            }}
          >
            <ListItem
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
              disablePadding
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {item.name || 'Unnamed Generation'}
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
                </Box>
              </Box>
              
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