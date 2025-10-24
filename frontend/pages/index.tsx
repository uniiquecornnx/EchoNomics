import Link from 'next/link';
import ConnectWallet from '../components/ConnectWallet';
import { useWallet } from '../src/hooks/useWallet';
import { useEffect, useState } from 'react';

export default function Home() {
  const { isConnected, address } = useWallet();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering wallet state on client
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main style={{padding: '3rem', fontFamily: 'system-ui, sans-serif'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1>Streaming Hackathon MVP</h1>
        <ConnectWallet />
      </div>
      
      {mounted && isConnected && (
        <div style={{background: '#f0f0f0', padding: '1rem', borderRadius: '8px', marginBottom: '2rem'}}>
          <p><strong>Wallet Connected:</strong> {address}</p>
        </div>
      )}
      
      <p>Quick links:</p>
      <ul>
        <li><Link href="/streamer/dashboard-simple">Streamer Dashboard (create stream)</Link></li>
        <li><Link href="/stream-viewer">Interactive Stream Viewer</Link></li>
        <li><Link href="/nexus-demo">Avail Nexus Cross-Chain Demo</Link></li>
        <li><Link href="/stream/test-stream">Test Stream with TipJar</Link></li>
      </ul>
    </main>
  );
}
