import React from 'react';
import { Box, Typography, Slider, TextField, MenuItem } from '@mui/material';
import { GenerationConfig } from '../../types/types';
import SentimentDistributionChart from '../SentimentDistributionChart';

interface Props {
    config: GenerationConfig;
    onChange: (key: keyof GenerationConfig, value: any) => void;
    isLoading: boolean;
}

const SentimentDistributionTab: React.FC<Props> = ({
    config,
    onChange,
    isLoading
}) => {
    const domains = ['all', 'business', 'technology', 'healthcare', 'education'];

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
            <SentimentDistributionChart distribution={config.sentimentDistribution} />

            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Sentiment Distribution
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography>Positive: {config.sentimentDistribution.positive}%</Typography>
                    <Slider
                        value={config.sentimentDistribution.positive}
                        onChange={(_, value) => handleSentimentChange('positive', value as number)}
                        max={100}
                        marks
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value}%`}
                    />

                    <Typography>Negative: {config.sentimentDistribution.negative}%</Typography>
                    <Slider
                        value={config.sentimentDistribution.negative}
                        onChange={(_, value) => handleSentimentChange('negative', value as number)}
                        max={100 - config.sentimentDistribution.positive}
                        marks
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value}%`}
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
                        onChange={(e) => onChange('rowCount', parseInt(e.target.value))}
                        inputProps={{ min: 1, max: 100000 }}
                        helperText="Number of sentences to generate (1-10000)"
                    />

                    <TextField
                        select
                        label="Domain"
                        value={config.domain}
                        onChange={(e) => onChange('domain', e.target.value)}
                        helperText="Select the content domain"
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