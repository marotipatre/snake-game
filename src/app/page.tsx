'use client'

import SnakeGame from './components/snake-game'
import { AptosWalletAdapterProvider} from '@aptos-labs/wallet-adapter-react';
import { Network } from "@aptos-labs/ts-sdk";


export default function Home() {
  const wallets: any[] = [];
  return (
    <div className="App">
      <header className="App-header">
              <AptosWalletAdapterProvider
          plugins={wallets}
          autoConnect={true}
          optInWallets={["Petra"]}
          dappConfig={{ network: Network.TESTNET }}
          onError={(error) => {
            console.log("error", error);
          }}
        >
        <SnakeGame/>
        </AptosWalletAdapterProvider>
      </header>
    </div>
  );
}

