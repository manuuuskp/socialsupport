export const saveAppState = (key: string, state: Record<string, any>): void => {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.warn(`Failed to save app state:`, error);
  }
};

export const loadFromLocalStorage = <T extends Record<string, any>>(
  sliceKeys: string[],
  defaultState?: T
): T => {
  try {
    const data = localStorage.getItem('appState');
    if (!data) return defaultState || ({} as T);

    const parsed = JSON.parse(data) as Record<string, any>;
    const merged: Record<string, any> = defaultState ? { ...defaultState } : {};

    sliceKeys.forEach((key) => {
      if (parsed[key] !== undefined) {
        merged[key] = parsed[key];
      }
    });

    return merged as T;
  } catch (error) {
    console.warn('Failed to load app state:', error);
    return defaultState || ({} as T);
  }
};

export const clearAppState = (): void => {
  try {
    localStorage.removeItem('appState');
  } catch (error) {
    console.warn('Failed to clear app state:', error);
  }
};
