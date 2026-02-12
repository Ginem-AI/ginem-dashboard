/* ============================================================
   API: GET markets/coins/gecko?vs_currency=usd&order=market_cap_desc&per_page=&page=
   Response: { data: { items, totalItems, currentPage, totalPages } }
============================================================ */
export interface GeckoCoinItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number | null;
  total_volume: number;
}
