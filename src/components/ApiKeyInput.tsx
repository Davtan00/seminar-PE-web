import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';

interface Props {
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyInput: React.FC<Props> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setApiKey(newValue);
    onApiKeyChange(newValue);
    if (!isTouched) setIsTouched(true);
  };

  const isValidApiKey = apiKey.startsWith('sk-') && apiKey.length > 20;

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        OpenAI API Key
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Your API key is securely transmitted and never stored in the browser.
        </Alert>
        
        <TextField
          fullWidth
          required
          type={showApiKey ? 'text' : 'password'}
          label="OpenAI API Key"
          value={apiKey}
          onChange={handleApiKeyChange}
          error={isTouched && !isValidApiKey}
          helperText={isTouched && !isValidApiKey ? 
            'Please enter a valid OpenAI API key starting with "sk-"' : 
            'Enter your OpenAI API key to generate sentiments'}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle api key visibility"
                  onClick={() => setShowApiKey(!showApiKey)}
                  edge="end"
                >
                  {showApiKey ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Paper>
  );
};

export default ApiKeyInput; 