import React, { useState } from 'react';
import {
  Paper,
  Typography,
  IconButton,
  Collapse,
  Box,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface Props {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  icon?: React.ReactNode;
}

const CollapsiblePanel: React.FC<Props> = ({
  title,
  children,
  defaultExpanded = true,
  icon
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const theme = useTheme();

  return (
    <Paper
      sx={{
        mb: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          backgroundColor: expanded ? 'grey.50' : 'transparent',
          borderBottom: expanded ? 1 : 0,
          borderColor: 'grey.200',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon}
          <Typography variant="subtitle1" fontWeight="600">
            {title}
          </Typography>
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>{children}</Box>
      </Collapse>
    </Paper>
  );
};

export default CollapsiblePanel; 
// Not being used currently but might come in handy later, so keeping it here. 