import React, { useState } from 'react';
import { CssBaseline, Box, Typography, Container, Paper, Tabs, Tab, Button, Slider, Alert, Snackbar } from '@mui/material';
import Grid from '@mui/material/Grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import GenerationForm from './components/GenerationForm';
import ModelParameters from './components/ModelParameters';
import LoadingIndicator from './components/LoadingIndicator';
import DownloadButton from './components/DownloadButton';
import AdvancedParameters from './components/AdvancedParameters';
import { GenerationConfig, GeneratedDataItem, GenerationResponse } from './types/types';
import GeneratedDataDisplay from './components/GeneratedDataDisplay';
import { generateData } from './services/configurationService';
import ApiKeyModal from './components/ApiKeyModal';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DownloadIcon from '@mui/icons-material/Download';

const theme = createTheme();

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
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 100,
    frequencyPenalty: 0.0,
    presencePenalty: 0.0,
    model: 'gpt-4o-mini',

    // Advanced Controls, set to a default value
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
    lexicalComplexity: 0.5
  });

  const [activeTab, setActiveTab] = useState(0);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

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
    
    if (!storedApiKey) {
      setShowApiKeyModal(true);
      return;
    }

    await generateWithApiKey(storedApiKey);
  };

  const generateWithApiKey = async (apiKey: string) => {
    setIsLoading(true);
    try {
      const response = await generateData(config, apiKey);
      setGeneratedResponse(response);
    } catch (error) {
      console.error('Generation failed:', error);
      // If API key is invalid, clear it and show modal again
      if ((error as any)?.message?.includes('API key')) {
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
    generateWithApiKey(apiKey);
  };

  const handleExportConfig = () => {
    const configJson = JSON.stringify(config, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentiment-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoadConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          if (e.target?.result) {
            const loadedConfig = JSON.parse(e.target.result as string);
            setConfig(loadedConfig);
            setShowSuccessNotification(true);
            setTimeout(() => {
              setShowSuccessNotification(false);
            }, 3000); // Hide after 3 seconds
          }
        } catch (error) {
          console.error('Error parsing config file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

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
              <Box sx={{ display: 'flex', gap: 2 }}>
                <input
                  type="file"
                  accept=".json"
                  style={{ display: 'none' }}
                  id="config-file-input"
                  onChange={handleLoadConfig}
                />
                <label htmlFor="config-file-input">
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
                    Load Config
                  </Button>
                </label>
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
                  startIcon={<PlayArrowIcon />}
                  onClick={handleGenerate}
                  disabled={isLoading}
                  sx={{ 
                    backgroundColor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }
                  }}
                >
                  {isLoading ? 'Generating...' : 'Generate Data'}
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
            {/* Tabs with fixed width and better spacing */}
            <Tabs 
              value={activeTab} 
              onChange={(_, newValue) => setActiveTab(newValue)}
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                backgroundColor: '#fff',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                minHeight: '48px',
                '& .MuiTab-root': {
                  minWidth: '200px', // Fixed width for tabs
                  minHeight: '48px',
                  textTransform: 'none', // Better text readability
                }
              }}
            >
              <Tab 
                icon={<TuneIcon />} 
                label="Model & Distribution" 
                iconPosition="start"
              />
              <Tab 
                icon={<SettingsIcon />} 
                label="Advanced Settings" 
                iconPosition="start"
              />
            </Tabs>

            {/* Content Area */}
            <Box sx={{ 
              flexGrow: 1, 
              overflowY: activeTab === 0 ? 'hidden' : 'auto',
              p: 3
            }}>
              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <ModelParameters config={config} onChange={handleConfigChange} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                    </Typography>
                    <GenerationForm 
                      config={config} 
                      onChange={handleConfigChange}
                      onGenerate={handleGenerate}
                      isLoading={isLoading}
                    />
                  </Grid>
                </Grid>
              )}
              {activeTab === 1 && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Advanced Settings
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Content Control
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* First column of advanced settings */}
                        <AdvancedParameterItem
                          label="Privacy Level"
                          description="Controls data privacy and synthetic generation"
                          value={config.privacyLevel}
                          onChange={(value) => handleConfigChange('privacyLevel', value)}
                        />
                        <AdvancedParameterItem
                          label="Bias Control"
                          description="Adjusts bias mitigation in generated content"
                          value={config.biasControl}
                          onChange={(value) => handleConfigChange('biasControl', value)}
                        />
                        <AdvancedParameterItem
                          label="Sentiment Intensity"
                          description="Controls strength of expressed sentiments"
                          value={config.sentimentIntensity}
                          onChange={(value) => handleConfigChange('sentimentIntensity', value)}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Generation Quality
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Second column of advanced settings */}
                        <AdvancedParameterItem
                          label="Realism"
                          description="Adjusts how realistic the generated content is"
                          value={config.realism}
                          onChange={(value) => handleConfigChange('realism', value)}
                        />
                        <AdvancedParameterItem
                          label="Domain Relevance"
                          description="Controls topic adherence"
                          value={config.domainRelevance}
                          onChange={(value) => handleConfigChange('domainRelevance', value)}
                        />
                        <AdvancedParameterItem
                          label="Diversity"
                          description="Adjusts variety in generated content"
                          value={config.diversity}
                          onChange={(value) => handleConfigChange('diversity', value)}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Paper>

          {/* Results Section */}
          {generatedResponse && (
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3,
                mt: 2,
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.1)',
                maxHeight: '30vh',
                overflowY: 'auto'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2
              }}>
                <Typography variant="h6">Generated Results</Typography>
                <DownloadButton data={generatedResponse} />
              </Box>
              <GeneratedDataDisplay data={generatedResponse.generated_data} />
            </Paper>
          )}

          {/* API Key Modal */}
          <ApiKeyModal
            open={showApiKeyModal}
            onClose={() => setShowApiKeyModal(false)}
            onSubmit={handleApiKeySubmit}
          />

          {/* Loading Indicator */}
          <LoadingIndicator open={isLoading} />

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

// New component for advanced parameter items
interface AdvancedParameterItemProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}

const AdvancedParameterItem: React.FC<AdvancedParameterItemProps> = ({
  label,
  description,
  value,
  onChange
}) => {
  return (
    <Box>
      <Typography variant="subtitle2">{label}</Typography>
      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
        {description}
      </Typography>
      <Slider
        value={value}
        onChange={(_, newValue) => onChange(newValue as number)}
        min={0}
        max={1}
        step={0.1}
        marks
        valueLabelDisplay="auto"
      />
    </Box>
  );
};

export default App;