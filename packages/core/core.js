(function(){
  const n = v => Number(v || 0);
  const fmt0 = v => new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 }).format(n(v));
  const fmt2 = v => new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 2 }).format(n(v));
  const signed = v => `${n(v) >= 0 ? "+" : ""}${fmt2(v)}`;
  const pct = v => `${n(v) >= 0 ? "+" : ""}${fmt2(v)}%`;
  function summarize(positions){
    const tw = positions.filter(p => p.currency === "TWD");
    const us = positions.filter(p => p.currency === "USD");
    const twCost = tw.reduce((s,p)=>s+n(p.invested_cost),0);
    const twValue = tw.reduce((s,p)=>s+n(p.market_value),0);
    const twPnl = tw.reduce((s,p)=>s+n(p.unrealized_pnl),0);
    const usCost = us.reduce((s,p)=>s+n(p.invested_cost),0);
    const usValue = us.reduce((s,p)=>s+n(p.market_value),0);
    const usPnl = us.reduce((s,p)=>s+n(p.unrealized_pnl),0);
    return {assetCount: positions.length, twCount: tw.length, usCount: us.length, twCost, twValue, twPnl, twRoi: twCost ? twPnl / twCost * 100 : 0, usCost, usValue, usPnl, usRoi: usCost ? usPnl / usCost * 100 : 0};
  }
  function classifyPosition(p){ return n(p.unrealized_pnl) >= 0 ? "gain" : "loss"; }
  window.IW_CORE = { n, fmt0, fmt2, signed, pct, summarize, classifyPosition };
})();
