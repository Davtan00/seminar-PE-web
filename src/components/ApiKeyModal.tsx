import React, { useState, FormEvent } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (apiKey: string) => void;
}

const ApiKeyModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState('');

  const getErrorMessage = () => {
    if (!apiKey.startsWith('sk-')) {
      return 'API key must start with "sk-"';
    }
    if (apiKey.length <= 20) {
      return 'API key must be longer than 20 characters';
    }
    return 'Please enter a valid OpenAI API key';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim().startsWith('sk-') || apiKey.length <= 20) {
      setError(getErrorMessage());
      return;
    }
    onSubmit(apiKey.trim());
    setApiKey('');
    setError('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Enter OpenAI API Key</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Your API key will be securely stored for this session only.
          </Alert>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="API Key"
            type={showApiKey ? 'text' : 'password'}
            fullWidth
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              if (error) setError('');
            }}
            onBlur={() => {
              if (apiKey && (!apiKey.startsWith('sk-') || apiKey.length <= 20)) {
                setError(getErrorMessage());
              }
            }}
            error={!!error}
            helperText={error || 'Enter your OpenAI API key'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowApiKey(!showApiKey)}
                    edge="end"
                  >
                    {showApiKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ApiKeyModal; 