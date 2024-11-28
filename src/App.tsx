import React, { useState, useEffect } from 'react';
import { CssBaseline, Box, Typography, Container, Paper, Tabs, Tab, Button, Slider, Alert, Snackbar, Switch, FormControlLabel, FormLabel } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DownloadButton from './components/DownloadButton';
import { GenerationConfig, GeneratedDataItem, GenerationResponse, RequestHistoryItem } from './types/types';
import GeneratedDataDisplay from './components/GeneratedDataDisplay';
import ApiKeyModal from './components/ApiKeyModal';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadIcon from '@mui/icons-material/Download';
import PieChartIcon from '@mui/icons-material/PieChart';
import ModelSettingsTab from './components/tabs/ModelSettingsTab';
import SentimentDistributionTab from './components/tabs/SentimentDistributionTab';
import AdvancedSettingsTab from './components/tabs/AdvancedSettingsTab';
import HistoryIcon from '@mui/icons-material/History';
import RequestsHistoryTab from './components/tabs/RequestsHistoryTab';
import { exportConfigToFile, loadConfigFromFile } from './utils/fileHandlers';
import { makeSecureRequest, stopPolling, isRequestInProgress } from './utils/secureApiClient';
import NameInputModal from './components/NameInputModal';
import CircularProgress from '@mui/material/CircularProgress';

const theme = createTheme();

// Add this before the App component
const mockGeneratedData: GenerationResponse = {
  request_id: "mock-123",
  generated_data: [
    {
      id: 1,
      text: "Sample positive sentiment",
      sentiment: "positive"
    },
    {
      id: 2,
      text: "I love their croissants; they're the best in town!",
      sentiment: "positive"
    },
    {
      id: 3,
      text: "The chocolate cake was simply divine.",
      sentiment: "positive"
    }
  ],
  summary: {
    total_generated: 1,  // Update this number based on your mock data length
    sentiment_distribution: {
      positive: 1,
      negative: 0,
      neutral: 0
    }
  }
};

interface TabProps {
  config: GenerationConfig;
  onChange: (key: keyof GenerationConfig, value: any) => void;
  isLoading: boolean;
}

interface HistoryTabProps {
  history: RequestHistoryItem[];
  onJsonDownload: (id: string) => void;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResponse, setGeneratedResponse] = useState<GenerationResponse | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [config, setConfig] = useState<GenerationConfig>({
    sentimentDistribution: {
      positive: 33,
      negative: 33,
      neutral: 34,
    },
    rowCount: 100,
    domain: 'all',

    // Model Parameters
    temperature: 1,
    topP: 1,
    maxTokens: 100,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    model: 'gpt-4o-mini',

    // Advanced Controls
    privacyLevel: 0.5,
    biasControl: 0.5,
    sentimentIntensity: 0.5,
    realism: 0.7,
    domainRelevance: 0.8,
    diversity: 0.6,
    temporalRelevance: 0.5,
    noiseLevel: 0.3,
    culturalSensitivity: 0.8,
    formality: 0.5,
    lexicalComplexity: 0.5,
    strictMode: false,
  });

  const [activeTab, setActiveTab] = useState(0);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [requestHistory, setRequestHistory] = useState<RequestHistoryItem[]>([{
    id: 'mock-test-request',
    timestamp: new Date('2024-01-01T12:00:00'),
    duration: 1234,
    config: { ...config },
    response: mockGeneratedData,
    status: 'success',
    isMockData: true,
    name: 'Mock Test Name'
  }]);

  const [showNameModal, setShowNameModal] = useState(false);
  const [pendingApiKey, setPendingApiKey] = useState<string | null>(null);
  const [activeRequestId, setActiveRequestId] = useState<string>('');

  const getStoredApiKey = (): string | null => {
    return sessionStorage.getItem('openai_api_key');
  };

  const handleConfigChange = (key: keyof GenerationConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleGenerate = async () => {
    const storedApiKey = getStoredApiKey();
    
    const tempId = Date.now().toString();
    setActiveRequestId(tempId);

    if (!storedApiKey) {
      console.log('No API key found, showing modal');
      setShowApiKeyModal(true);
      return;
    }

    setShowNameModal(true);
  };

  const generateWithApiKey = async (apiKey: string, name: string) => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const response = await makeSecureRequest(apiKey, config);
      
      // Update activeRequestId with the real request_id from backend
      setActiveRequestId(response.data.request_id);

      // Remove the processing entry and add the success entry
      setRequestHistory(prev => {
        // Filter out the processing entry with the same name
        const filteredHistory = prev.filter(item => 
          !(item.status === 'processing' && item.name === name)
        );
        
        // Add the new success entry
        return [{
          id: response.data.request_id,
          name: name,
          timestamp: new Date(),
          duration: Date.now() - startTime,
          config: { ...config },
          responseSize: response.data.generated_data.length,
          response: response.data,
          status: 'success'
        }, ...filteredHistory];
      });

      setGeneratedResponse(response.data);

    } catch (error: any) {
      console.error('Generation failed:', error);

      // Similarly for error state, remove the processing entry
      setRequestHistory(prev => {
        const filteredHistory = prev.filter(item => 
          !(item.status === 'processing' && item.name === name)
        );
        
        return [{
          id: Date.now().toString(),
          timestamp: new Date(),
          duration: Date.now() - startTime,
          config: { ...config },
          response: null,
          status: 'error',
          name: name
        }, ...filteredHistory];
      });

      if (error?.response?.status === 401 || error?.message?.includes('API key')) {
        console.log('Invalid API key, clearing and showing modal');
        sessionStorage.removeItem('openai_api_key');
        setShowApiKeyModal(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySubmit = (apiKey: string) => {
    sessionStorage.setItem('openai_api_key', apiKey);
    setShowApiKeyModal(false);
    setPendingApiKey(apiKey);
    setShowNameModal(true);
  };

  const handleNameSubmit = (name: string) => {
    setShowNameModal(false);
    
    setRequestHistory(prev => [{
      id: activeRequestId,
      name: name,
      timestamp: new Date(),
      status: 'processing',
      config: { ...config },
      duration: 0,
      response: null,
    }, ...prev]);

    if (pendingApiKey) {
      generateWithApiKey(pendingApiKey, name);
      setPendingApiKey(null);
    } else {
      const storedApiKey = getStoredApiKey();
      if (storedApiKey) {
        generateWithApiKey(storedApiKey, name);
      }
    }
  };

  const handleExportConfig = () => {
    exportConfigToFile(config);
  };

  const handleLoadConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadConfigFromFile(
        file,
        (loadedConfig) => {
          setConfig(loadedConfig);
          setShowSuccessNotification(true);
          setTimeout(() => {
            setShowSuccessNotification(false);
          }, 3000);
        },
        (error) => {
          console.error('Error parsing config file:', error);
        }
      );
    }
  };

  const StrictModeToggle = () => (
    <FormControlLabel
      control={
        <Switch
          checked={config.strictMode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange('strictMode', e.target.checked)}
          color="success"
        />
      }
      label="Strict Mode"
      sx={{ color: 'white' }}
    />
  );

  const handleJsonDownload = (itemId: string) => {
    setRequestHistory(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          jsonDownloaded: true,
          response: item.response
        };
      }
      return item;
    }));
  };

  useEffect(() => {
    return () => {
      // Cleanup all active polls when component unmounts
      if (generatedResponse?.request_id) {
        stopPolling(generatedResponse.request_id);
      }
    };
  }, [generatedResponse?.request_id]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100vh',
        backgroundColor: '#f5f7fa',
        padding: '1rem'
      }}>
        <Container maxWidth={false} sx={{ width: '98%' }}>
          {/* Header with Action Buttons */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 2,
              backgroundColor: 'primary.main',
              color: 'white',
              borderRadius: '12px'
            }}
          >
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Box>
                <Typography variant="h4" gutterBottom>
                  Sentiment Generator
                </Typography>
                <Typography variant="subtitle1">
                  Configure and generate sentiment data with advanced AI models
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <StrictModeToggle />
                {React.createElement('input', {
                  type: "file",
                  accept: ".json",
                  style: { display: 'none' },
                  id: "config-file-input",
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleLoadConfig(e)
                })}
                <FormLabel component="label" htmlFor="config-file-input">
                  <Button
                    variant="contained"
                    color="secondary"
                    component="span"
                    startIcon={<DownloadIcon />}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      }
                    }}
                  >
                    Import Config
                  </Button>
                </FormLabel>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<SaveIcon />}
                  onClick={handleExportConfig}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  Export Config
                </Button>
                <Button
                  variant="contained"
                  startIcon={isLoading || isRequestInProgress(activeRequestId) ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <PlayArrowIcon />
                  )}
                  onClick={handleGenerate}
                  disabled={isLoading || isRequestInProgress(activeRequestId)}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '&:disabled': {
                      backgroundColor: 'white',
                      color: 'primary.main',
                      opacity: 0.9,
                    },
                    minWidth: '160px'  // Ensures button doesn't change size
                  }}
                >
                  {isLoading || isRequestInProgress(activeRequestId) ? 'Processing' : 'Generate Data'}
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Main Content */}
          <Paper
            elevation={2}
            sx={{
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.1)',
              height: 'calc(100vh - 200px)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(event: React.SyntheticEvent, newValue: number) => setActiveTab(newValue)}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                backgroundColor: '#fff',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                minHeight: '48px',
                '& .MuiTab-root': {
                  minWidth: '180px',
                  minHeight: '48px',
                  textTransform: 'none',
                }
              }}
            >
              <Tab
                icon={<TuneIcon />}
                label="Model Settings"
                iconPosition="start"
              />
              <Tab
                icon={<PieChartIcon />}
                label="Sentiment Distribution"
                iconPosition="start"
              />
              <Tab
                icon={<SettingsIcon />}
                label="Advanced Settings"
                iconPosition="start"
              />
              <Tab
                icon={<HistoryIcon />}
                label="Requests"
                iconPosition="start"
              />
            </Tabs>

            {/* Content Area */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
              {activeTab === 0 && (
                <ModelSettingsTab
                  config={config}
                  onChange={handleConfigChange}
                  isLoading={isLoading}
                />
              )}
              {activeTab === 1 && (
                <SentimentDistributionTab
                  config={config}
                  onChange={handleConfigChange}
                  isLoading={isLoading}
                />
              )}
              {activeTab === 2 && (
                <AdvancedSettingsTab
                  config={config}
                  onChange={handleConfigChange}
                  isLoading={isLoading}
                />
              )}
              {activeTab === 3 && (
                <RequestsHistoryTab 
                  history={requestHistory} 
                  onJsonDownload={handleJsonDownload}
                />
              )}
            </Box>


          </Paper>

          {/* openAI API Key Modal,we might need another backend API key to secure this more. */}
          <ApiKeyModal
            open={showApiKeyModal}
            onClose={() => setShowApiKeyModal(false)}
            onSubmit={handleApiKeySubmit}
          />
          <NameInputModal
            open={showNameModal}
            onClose={() => {
              setShowNameModal(false);
              setPendingApiKey(null);
            }}
            onSubmit={handleNameSubmit}
          />

          <Snackbar
            open={showSuccessNotification}
            autoHideDuration={3000}
            onClose={() => setShowSuccessNotification(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ mt: 7 }}
          >
            <Alert severity="success" sx={{ width: '100%' }}>
              Configuration loaded successfully
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}


export default App;