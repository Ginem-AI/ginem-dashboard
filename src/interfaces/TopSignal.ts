export interface IGainerSignal {
  symbol: string;
  changePercent: number; // positive number
}

export interface ILoserSignal {
  symbol: string;
  changePercent: number; // negative number
}

export interface ITopSignalsResponse {
  gainers: IGainerSignal[];
  losers: ILoserSignal[];
}
