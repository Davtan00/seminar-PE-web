// components/AnalysisDownloadButton.tsx
import React, { useEffect, useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { getPdfUrl } from '../utils/secureApiClient';

interface Props {
  requestId: string;
  onPdfDownload?: () => void;
}

export const AnalysisDownloadButton: React.FC<Props> = ({ requestId, onPdfDownload }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(getPdfUrl(requestId));

  useEffect(() => {
    const storedUrl = getPdfUrl(requestId);
    if (storedUrl) {
      setPdfUrl(storedUrl);
      return;
    }

    const handlePdfReady = (event: CustomEvent) => {
      if (event.detail === requestId) {
        setPdfUrl(getPdfUrl(requestId));
      }
    };
    // Listen for PDF ready event
    window.addEventListener('pdfReady', handlePdfReady as EventListener);
    return () => window.removeEventListener('pdfReady', handlePdfReady as EventListener);
  }, [requestId]);

  if (!pdfUrl) return null;

  return (
    <Tooltip title="Download Analysis PDF">
      <IconButton 
        onClick={() => {
          window.open(pdfUrl, '_blank');
          onPdfDownload?.();
        }}
      >
        <PictureAsPdfIcon />
      </IconButton>
    </Tooltip>
  );
};