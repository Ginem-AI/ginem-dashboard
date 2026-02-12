export interface IScreenerCreateRequest {
  screenerId: number;
  screenerUserId: number;
  screenerCoinSymbol: string;
  screenerProfile: "SCALPING" | "SWING" | "INVEST";
}

export interface IScreener {
  id: number;
  screenerId: number;

  symbol: string;
  trend: "BULLISH" | "BEARISH" | "SIDEWAYS" | string;
  profile: "SCALPING" | "INTRADAY" | "SWING" | string;

  entryBuy: string;
  entrySell: string;
  stopLoss: string;
  takeProfit: string;

  confidence: number;
  reasoning: string;

  createdAt: string;
}
