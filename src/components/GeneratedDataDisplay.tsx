import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  Chip
} from '@mui/material';

interface ResponseData {
  request_id: string;
  generated_data: any[];
  summary: {
    total_generated: number;
    sentiment_distribution: {
      positive: number;
      negative: number;
      neutral: number;
    }
  }
}

interface Props {
  data: ResponseData;
}

const GeneratedDataDisplay = ({ data }: Props) => {
  if (!data || !data.summary) {
    return null;
  }

  const { summary } = data;
  const { sentiment_distribution } = summary;

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Generation Summary
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1">
          Total Generated: {summary.total_generated}
        </Typography>
      </Box>
      <Box>
        <Typography variant="h6" gutterBottom>
          Sentiment Distribution
        </Typography>
        <List>
          <ListItem>
            <Chip 
              label={`Positive: ${sentiment_distribution.positive}`}
              color="success"
              sx={{ mr: 1 }}
            />
            <Chip 
              label={`Negative: ${sentiment_distribution.negative}`}
              color="error"
              sx={{ mr: 1 }}
            />
            <Chip 
              label={`Neutral: ${sentiment_distribution.neutral}`}
              color="default"
            />
          </ListItem>
        </List>
      </Box>
    </Paper>
  );
};

export default GeneratedDataDisplay; 