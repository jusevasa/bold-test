import { Header } from '../components/header';
import { Helmet } from 'react-helmet';

interface LayoutProps {
  children: React.ReactNode;
}
export const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Bold | Ventas</title>
        <meta name='description' content='Ventas de tus productos' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='https://bold.co/favicon-32x32.png' />
        <link rel='canonical' href='https://bold.co/' />
      </Helmet>
      <Header />
      {children}
    </>
  );
};
