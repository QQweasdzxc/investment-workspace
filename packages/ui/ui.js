(function(){
  const { fmt0, fmt2, signed, pct, summarize, classifyPosition } = window.IW_CORE;
  const cfg = window.IW_CONFIG;
  function el(id){ return document.getElementById(id); }
  function setText(id, text){ const node = el(id); if(node) node.textContent = text; }
  function renderKpis(summary){
    setText("kpiAssetCount", `${summary.assetCount} 檔`);
    setText("kpiTwValue", `NT$ ${fmt0(summary.twValue)}`);
    setText("kpiTwPnl", `${signed(summary.twPnl)} / ${pct(summary.twRoi)}`);
    setText("kpiUsValue", `US$ ${fmt2(summary.usValue)}`);
  }
  function positionCard(p){
    const trend = classifyPosition(p);
    return `<article class="asset-card ${trend}">
      <div class="asset-head"><div><strong>${p.symbol}</strong><span>${p.name || ""}</span></div><em>${p.market === "US" ? "🇺🇸 美股" : "🇹🇼 台股"}</em></div>
      <div class="metric-grid">
        <div><small>股數</small><b>${fmt2(p.quantity).replace(/\.00$/,"")}</b></div>
        <div><small>均價</small><b>${fmt2(p.avg_cost)}</b></div>
        <div><small>成本</small><b>${fmt2(p.invested_cost)}</b></div>
        <div><small>市值</small><b>${fmt2(p.market_value)}</b></div>
      </div>
      <div class="asset-foot"><span>${p.currency}</span><b>${signed(p.unrealized_pnl)} / ${pct(p.unrealized_pct)}</b></div>
    </article>`;
  }
  function renderPositions(positions){
    const tw = positions.filter(p => p.market === "TW");
    const us = positions.filter(p => p.market === "US");
    el("twAssets").innerHTML = tw.map(positionCard).join("") || `<p class="empty">尚無台股資料</p>`;
    el("usAssets").innerHTML = us.map(positionCard).join("") || `<p class="empty">尚無美股資料</p>`;
    el("twAssetsMirror").innerHTML = el("twAssets").innerHTML;
    el("usAssetsMirror").innerHTML = el("usAssets").innerHTML;
  }
  function renderHealth(data){
    const rows = [
      ["Cloud Database", "Supabase", "READY"],
      ["Workspace", `${cfg.workspaceUser} / ${cfg.workspaceId}`, "READY"],
      ["Bootstrap", `${data.positions.length} assets`, "READY"],
      ["Web", "GitHub Pages ready", "READY"],
      ["Chrome", "Extension package ready", "READY"]
    ];
    el("healthRows").innerHTML = rows.map(r => `<div class="health-row"><span>${r[0]}</span><small>${r[1]}</small><b>${r[2]}</b></div>`).join("");
  }
  function renderTransactions(transactions){
    el("txRows").innerHTML = transactions.slice(0, 8).map(t => `<div class="tx-row"><span>${t.trade_date}</span><b>${t.symbol}</b><small>${t.trade_type}</small><em>${fmt2(t.net_amount)} ${t.currency}</em></div>`).join("") || `<p class="empty">尚無交易流水</p>`;
  }
  function bindTabs(){
    document.querySelectorAll("[data-tab]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-tab]").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        el(btn.dataset.tab).classList.add("active");
      });
    });
  }
  async function boot(){
    bindTabs();
    setText("productName", cfg.productName);
    setText("productSub", cfg.subtitle);
    setText("version", `v${cfg.version}`);
    setText("workspace", `${cfg.workspaceUser} · Workspace ${cfg.workspaceId}`);
    setText("status", "連線 Supabase 中…");
    try{
      const data = await window.IW_API.loadWorkspace();
      renderKpis(summarize(data.positions));
      renderPositions(data.positions);
      renderHealth(data);
      renderTransactions(data.transactions);
      setText("status", `已同步：${new Date().toLocaleString("zh-TW")}`);
    }catch(err){
      console.error(err);
      setText("status", `讀取失敗：${err.message}`);
      el("errorBox").textContent = err.message;
      el("errorBox").style.display = "block";
    }
  }
  window.IW_UI = { boot };
})();
