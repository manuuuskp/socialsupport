import i18n from "../../i18n";

export const ERROR_MESSAGES = {
  get network() { return i18n.t('error.network'); },
  get auth() { return i18n.t('error.auth'); },
  get forbidden() { return i18n.t('error.forbidden'); },
  get notFound() { return i18n.t('error.notFound'); },
  get server() { return i18n.t('error.server'); },
  get openAIInvalidKey() { return i18n.t('error.openAIInvalidKey'); },
  get unknown() { return i18n.t('error.unknown'); },
  get configureKey() { return i18n.t('error.configureKey'); },
  get invalidResponse() { return i18n.t('error.invalidResponse'); }
};