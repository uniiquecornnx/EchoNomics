import '../styles/globals.css';
import type { AppProps } from 'next/app';
import WalletProviders from '../src/wallet/providers';
import { WalletProvider } from '../src/contexts/WalletContext';
import '@rainbow-me/rainbowkit/styles.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProviders>
      <WalletProvider>
        <Component {...pageProps} />
      </WalletProvider>
    </WalletProviders>
  );
}