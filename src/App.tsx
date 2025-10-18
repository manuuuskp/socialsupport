import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import './i18n';
import { store } from './store';
import Layout from './pages/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import { useGlobalErrorHandler } from './hooks/useGlobalErrorHandler';

function App() {
  const { i18n } = useTranslation();

  useGlobalErrorHandler();

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Router>
          <Layout />
        </Router>
      </Provider>
    </ErrorBoundary>
  );
}

export default App
