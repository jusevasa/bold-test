import { createRoot } from 'react-dom/client';
import { Settings } from 'luxon';

import App from './App.tsx';
import './index.css';
import { SalesProvider } from './context/sales.context.tsx';

Settings.defaultLocale = 'es';

createRoot(document.getElementById('root')!).render(
  <SalesProvider>
    <App />
  </SalesProvider>
);
