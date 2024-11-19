import { GenerationConfig } from "../types/types";

export const exportConfigToFile = (config: GenerationConfig) => {
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

export const loadConfigFromFile = (
  file: File,
  onSuccess: (config: GenerationConfig) => void,
  onError: (error: Error) => void
) => {
  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    try {
      if (e.target?.result) {
        const loadedConfig = JSON.parse(e.target.result as string);
        onSuccess(loadedConfig);
      }
    } catch (error) {
      onError(error as Error);
    }
  };
  reader.readAsText(file);
}; 