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

interface Props {
  history: RequestHistoryItem[];
}

const RequestsHistoryTab: React.FC<Props> = ({ history }) => {
  const downloadJson = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
                <Tooltip title="Download Response">
                  <IconButton
                    onClick={() => downloadJson(item.response, `response-${item.id}.json`)}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download Config">
                  <IconButton
                    onClick={() => downloadJson(item.config, `config-${item.id}.json`)}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default RequestsHistoryTab; 