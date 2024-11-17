import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { GeneratedDataItem } from '../types/types';

interface Props {
  data: GeneratedDataItem[];
}

const GeneratedDataDisplay: React.FC<Props> = ({ data }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Generated Sentiments ({data.length})
      </Typography>
      <List>
        {data.map((item) => (
          <ListItem key={item.id} divider>
            <ListItemText
              primary={item.text}
              secondary={
                <Chip
                  label={item.sentiment}
                  color={getSentimentColor(item.sentiment)}
                  size="small"
                  sx={{ mt: 1 }}
                />
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default GeneratedDataDisplay; 