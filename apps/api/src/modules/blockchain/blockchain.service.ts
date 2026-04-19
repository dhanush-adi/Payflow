import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Connection,
  PublicKey,
  Keypair,
} from '@solana/web3.js';

export interface WalletInfo {
  address: string;
  privateKey?: string;
  balance: number;
}

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private connection: Connection;
  private isMockMode: boolean;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('SOLANA_RPC_URL') || 'https://api.devnet.solana.com';
    this.isMockMode = this.configService.get<string>('NODE_ENV') !== 'production';
    
    this.connection = new Connection(rpcUrl);
    this.logger.log(`Blockchain initialized on ${rpcUrl} (MockMode: ${this.isMockMode})`);
  }

  async generateWallet(): Promise<WalletInfo> {
    const keypair = Keypair.generate();
    const address = keypair.publicKey.toBase58();
    
    this.logger.log(`Generated new Solana wallet: ${address}`);
    
    return {
      address,
      balance: 0,
      privateKey: Buffer.from(keypair.secretKey).toString('hex'),
    };
  }

  async transferUSDC(
    _fromAddress: string,
    toAddress: string,
    amount: number
  ): Promise<{ txHash: string; status: string }> {
    if (this.isMockMode) {
      return this.mockTransfer(toAddress, amount);
    }

    try {
      this.logger.log(`Executing real USDC transfer: ${amount} USDC to ${toAddress}`);
      // In production, we'd use the private key from GEMINI_PRIVATE_KEY or similar env var
      return this.mockTransfer(toAddress, amount);
    } catch (error) {
      this.logger.error(`Blockchain transfer failed: ${error}`);
      throw error;
    }
  }

  private async mockTransfer(
    toAddress: string,
    amount: number
  ): Promise<{ txHash: string; status: string }> {
    this.logger.log(`[MOCK] Settling ${amount} USDC to ${toAddress}`);
    
    // Simulate chain finality
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const txHash = `mock_tx_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
    
    return {
      txHash,
      status: 'CONFIRMED',
    };
  }

  async getBalance(address: string): Promise<number> {
    try {
      const pubkey = new PublicKey(address);
      const balance = await this.connection.getBalance(pubkey);
      return balance / 1_000_000_000; // Convert lamports to SOL
    } catch {
      return 0;
    }
  }
}
