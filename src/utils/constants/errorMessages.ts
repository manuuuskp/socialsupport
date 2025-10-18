import i18n from "../../i18n";

export const ERROR_MESSAGES = {
  network: i18n.t('error.network') || 'Network error. Please check your connection.',
  auth: i18n.t('error.auth') || 'Authentication failed. Please check your API key.',
  forbidden: i18n.t('error.forbidden') || 'Access denied. You do not have permission.',
  notFound: i18n.t('error.notFound') || 'The requested resource was not found.',
  server: i18n.t('error.server') || 'Server error. Please try again later.',
  openAIInvalidKey: i18n.t('error.openAIInvalidKey') || 'Invalid OpenAI API key. Please check your configuration.',
  unknown: i18n.t('error.unknown') || 'Unknown error occurred.',
  configureKey: i18n.t('error.configureKey') || 'OpenAI API key is not configured. Please add OPENAI_KEY.',
  invalidResponse: i18n.t('error.invalidResponse') || 'Invalid response from OpenAI API'
};