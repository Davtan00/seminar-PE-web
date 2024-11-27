import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

const NameInputModal: React.FC<Props> = ({ open, onClose, onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
      setName('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Name Your Generation</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Generation Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Technology Reviews Testing"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!name.trim()}>
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NameInputModal; 