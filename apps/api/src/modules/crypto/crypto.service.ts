import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

export interface ConversionResult {
  inrAmount: number;
  usdcAmount: number;
  rate: number;
  timestamp: Date;
}

@Injectable()
export class CryptoService {
  private readonly coinGeckoBaseUrl = 'https://api.coingecko.com/api/v3';
  private cache: Map<string, { data: ConversionResult; expiry: number }> = new Map();
  private readonly cacheDuration = 60000;

  constructor(
    private http: HttpService,
    private config: ConfigService,
  ) {}

  async convertINRtoUSDC(inrAmount: number): Promise<ConversionResult> {
    const cached = this.getCachedRate();
    if (cached) {
      return { ...cached, inrAmount, usdcAmount: inrAmount * cached.rate };
    }

    try {
      const usdInrRate = await this.fetchUSDINRRate();
      const rate = 1 / usdInrRate;
      
      const result: ConversionResult = {
        inrAmount,
        usdcAmount: Math.round(inrAmount * rate * 100000) / 100000,
        rate: Math.round(rate * 100000) / 100000,
        timestamp: new Date(),
      };

      this.cacheRate(result);
      return result;
    } catch (error) {
      const fallbackRate = 0.012;
      return {
        inrAmount,
        usdcAmount: Math.round(inrAmount * fallbackRate * 100000) / 100000,
        rate: fallbackRate,
        timestamp: new Date(),
      };
    }
  }

  async getCurrentRate(): Promise<number> {
    const cached = this.getCachedRate();
    if (cached) return cached.rate;

    try {
      const usdInrRate = await this.fetchUSDINRRate();
      const rate = 1 / usdInrRate;
      const result = { rate: Math.round(rate * 100000) / 100000, timestamp: new Date() };
      this.cacheRate(result as ConversionResult);
      return result.rate;
    } catch {
      return 0.012;
    }
  }

  private async fetchUSDINRRate(): Promise<number> {
    const apiKey = this.config.get('COINGECKO_API_KEY');
    const headers = apiKey ? { 'x-cg-demo-api-key': apiKey } : {};

    const { data } = await firstValueFrom(
      this.http.get(`${this.coinGeckoBaseUrl}/simple/price`, {
        params: { ids: 'usd', vs_currencies: 'inr' },
        headers,
      }),
    );

    if (!data?.usd?.inr) {
      throw new HttpException('Failed to fetch exchange rate', HttpStatus.SERVICE_UNAVAILABLE);
    }

    return data.usd.inr;
  }

  private getCachedRate(): ConversionResult | null {
    const cached = this.cache.get('usdc_inr');
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    return null;
  }

  private cacheRate(data: ConversionResult): void {
    this.cache.set('usdc_inr', { data, expiry: Date.now() + this.cacheDuration });
  }
}