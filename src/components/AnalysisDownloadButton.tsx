// components/AnalysisDownloadButton.tsx
import React, { useEffect, useState } from 'react';
import { getPdfUrl } from '../utils/secureApiClient';

interface Props {
  requestId: string;
}

export const AnalysisDownloadButton: React.FC<Props> = ({ requestId }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(getPdfUrl(requestId));

  useEffect(() => {
    // Check if URL is already in localStorage
    const storedUrl = getPdfUrl(requestId);
    if (storedUrl) {
      setPdfUrl(storedUrl);
      return;
    }

    // Listen for PDF ready event
    const handlePdfReady = (event: CustomEvent) => {
      if (event.detail === requestId) {
        setPdfUrl(getPdfUrl(requestId));
      }
    };

    window.addEventListener('pdfReady', handlePdfReady as EventListener);
    return () => window.removeEventListener('pdfReady', handlePdfReady as EventListener);
  }, [requestId]);

  if (!pdfUrl) return null;

  return (
    <button 
      onClick={() => window.open(pdfUrl, '_blank')}
      className="download-button"
    >
      Download Analysis PDF
    </button>
  );
};