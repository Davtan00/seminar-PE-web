import React from 'react';
import { Box, Typography, Slider, TextField, MenuItem } from '@mui/material';
import { GenerationConfig } from '../../types/types';
import SentimentDistributionChart from '../SentimentDistributionChart';

interface Props {
    config: GenerationConfig;
    onChange: (key: keyof GenerationConfig, value: any) => void;
    isLoading: boolean;
}

const sliderStyles = {
  '& .MuiSlider-thumb': {
    width: 12,
    height: 12,
    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0px 0px 0px 8px rgba(25, 118, 210, 0.16)',
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.32,
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#1976d2',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
};

const SentimentDistributionTab = ({
    config,
    onChange,
    isLoading
}: Props) => {
    const domains = ['ecommerce', 'technology', 'software', 'restaurant', 'hotel', 'education','healthcare'] ;

    const calculateNewDistribution = (type: 'positive' | 'negative', value: number, currentDistribution: GenerationConfig['sentimentDistribution']) => {
        if (type === 'positive') {
            const remaining = 100 - value;
            // Handle edge case when both negative and neutral are 0, otherwise you get ugly NaN 
            const ratio = (currentDistribution.negative + currentDistribution.neutral) === 0 
                ? 0 
                : currentDistribution.negative / (currentDistribution.negative + currentDistribution.neutral);
            
            return {
                positive: value,
                negative: Math.round(remaining * ratio),
                neutral: Math.round(remaining * (1 - ratio))
            };
        }
    
        return {
            positive: currentDistribution.positive,
            negative: value,
            neutral: 100 - currentDistribution.positive - value
        };
    };

    const handleSentimentChange = (type: 'positive' | 'negative', value: number) => {
        const newDistribution = calculateNewDistribution(type, value, config.sentimentDistribution);
        onChange('sentimentDistribution', newDistribution);
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Distribution Preview
            </Typography>
            {SentimentDistributionChart({ distribution: config.sentimentDistribution })}

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Sentiment Distribution
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography>Positive: {config.sentimentDistribution.positive}%</Typography>
                    <Slider
                        value={config.sentimentDistribution.positive}
                        onChange={(_: Event, value: number | number[]) => 
                            handleSentimentChange('positive', Array.isArray(value) ? value[0] : value)
                        }
                        max={100}
                        marks
                        valueLabelDisplay="auto"
                        disabled={isLoading}
                        sx={sliderStyles}
                    />

                    <Typography>Negative: {config.sentimentDistribution.negative}%</Typography>
                    <Slider
                        value={config.sentimentDistribution.negative}
                        onChange={(_: Event, value: number | number[]) => 
                            handleSentimentChange('negative', Array.isArray(value) ? value[0] : value)
                        }
                        max={100 - config.sentimentDistribution.positive}
                        marks
                        valueLabelDisplay="auto"
                        disabled={isLoading}
                        sx={sliderStyles}
                    />

                    <Typography>
                        Neutral: {config.sentimentDistribution.neutral}%
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            (Automatically calculated)
                        </Typography>
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Generation Settings
                </Typography>

                <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: '1fr 1fr' }}>
                    <TextField
                        label="Number of Rows"
                        type="number"
                        value={config.rowCount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('rowCount', parseInt(e.target.value))}
                        inputProps={{ min: 1, max: 100000 }}
                        helperText="Number of sentences to generate (1-10000)"
                    />

                    <TextField
                        select
                        label="Domain"
                        value={config.domain}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('domain', e.target.value)}
                        helperText="Select the content domain"
                        SelectProps={{
                            displayEmpty: true,
                            renderValue: (selected: any) => {
                                if (!selected) {
                                    return <Typography color="text.secondary">Enter domain here</Typography>;
                                }
                                return selected.charAt(0).toUpperCase() + selected.slice(1);
                            },
                            MenuProps: {
                                PaperProps: {
                                    sx: {
                                        maxHeight: 300,
                                        '& .MuiMenuItem-root': {
                                            py: 1,
                                            px: 2,
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                            },
                                        },
                                    },
                                },
                            },
                        }}
                        sx={{
                            '& .MuiSelect-select': {
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                            },
                        }}
                    >
                        {domains.map((domain) => (
                            <MenuItem key={domain} value={domain}>
                                {domain.charAt(0).toUpperCase() + domain.slice(1)}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>
        </Box>
    );
};

export default SentimentDistributionTab; 