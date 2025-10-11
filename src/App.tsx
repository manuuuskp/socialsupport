import Layout from './pages/Layout'
import './i18n';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

function App() {

  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.dir();
    document.documentElement.lang = i18n.language;
  }, [i18n.language])

  return (
    <>
      <Layout />
    </>
  )
}

export default App
