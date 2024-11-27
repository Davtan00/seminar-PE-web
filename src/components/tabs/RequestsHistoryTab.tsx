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
  onDownloadComplete: (itemId: string) => void;
}

const RequestsHistoryTab: React.FC<Props> = ({ history, onDownloadComplete }) => {
  const downloadJson = (data: any, filename: string, itemId?: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (filename.includes('generated-data') && itemId) {
      onDownloadComplete(itemId);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Generation History</Typography>
      <List>
        {history.map((item) => (
          <Paper key={item.id} sx={{ mb: 2, p: 2 }}>
            <ListItem
              sx={{ display: 'flex', justifyContent: 'space-between' }}
              disablePadding
            >
              <Box>
                <Typography variant="subtitle1">
                  {new Date(item.timestamp).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {item.duration}ms
                </Typography>
                <Chip
                  label={item.status}
                  color={item.status === 'success' ? 'success' : 'error'}
                  size="small"
                  sx={{ mt: 1 }}
                />
                {item.isMockData && (
                  <Chip
                    label="TEST REQUEST"
                    color="info"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
              <Box>
                <Tooltip title="Download Config">
                  <IconButton
                    onClick={() => downloadJson(item.config, `config-${item.id}.json`)}
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
                          `generated-data-${item.id}.json`,
                          item.id
                        )}
                        disabled={item.downloaded}
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