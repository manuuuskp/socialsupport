import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Provider } from 'react-redux';
import './i18n';
import { store } from './store';
import Layout from './pages/Layout'

function App() {

  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language])

  return (
    <Provider store={store}>
      <Layout />
    </Provider>
  )
}

export default App
