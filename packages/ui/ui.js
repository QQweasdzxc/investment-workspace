(function(){
  const { fmt0, fmt2, signed, pct, summarize, classifyPosition } = window.IW_CORE;
  const cfg = window.IW_CONFIG;
  function el(id){ return document.getElementById(id); }
  function setText(id, text){ const node = el(id); if(node) node.textContent = text; }
  function renderKpis(summary){
    setText("kpiTotalCost", `NT$ ${fmt0(summary.twCost)}`);
    setText("kpiTwValue", `NT$ ${fmt0(summary.twValue)}`);
    setText("kpiTwPnl", `${signed(summary.twPnl)} / ${pct(summary.twRoi)}`);
    setText("kpiUsValue", `US$ ${fmt2(summary.usValue)}`);
  }
  function positionCard(p){
    const trend = classifyPosition(p);
    return `<article class="asset-card ${trend}">
      <div class="asset-head"><div class="asset-title"><strong>${p.symbol}</strong><span>${p.name || ""}</span></div><div class="asset-price"><small>今日</small><b>${fmt2(p.last_price)}</b><em>${p.market === "US" ? "🇺🇸" : "🇹🇼"}</em></div></div>
      <div class="metric-grid compact"><div><small>股數</small><b>${fmt2(p.quantity).replace(/\.00$/,"")}</b></div><div><small>均價</small><b>${fmt2(p.avg_cost)}</b></div><div><small>成本</small><b>${fmt2(p.invested_cost)}</b></div><div><small>市值</small><b>${fmt2(p.market_value)}</b></div></div>
      <div class="asset-foot pnl-band"><span>${p.currency}</span><b>${signed(p.unrealized_pnl)} / ${pct(p.unrealized_pct)}</b></div>
    </article>`;
  }
  function renderPositions(positions){
    const tw = positions.filter(p => p.market === "TW");
    const us = positions.filter(p => p.market === "US");
    el("twAssets").innerHTML = tw.map(positionCard).join("") || `<p class="empty">尚無台股資料</p>`;
    el("usAssets").innerHTML = us.map(positionCard).join("") || `<p class="empty">尚無美股資料</p>`;
    if(el("twAssetsMirror")) el("twAssetsMirror").innerHTML = el("twAssets").innerHTML;
    if(el("usAssetsMirror")) el("usAssetsMirror").innerHTML = el("usAssets").innerHTML;
  }
  function renderHealth(data){
    const rows = [["Cloud Database","Supabase","READY"],["Workspace",`${cfg.workspaceUser} / ${cfg.workspaceId}`,"READY"],["Bootstrap",`${data.positions.length} assets`,"READY"],["Design System","red profit / green loss","READY"],["Chrome & Web","shared UI","READY"]];
    el("healthRows").innerHTML = rows.map(r => `<div class="health-row"><span>${r[0]}</span><small>${r[1]}</small><b>${r[2]}</b></div>`).join("");
  }
  function renderTransactions(transactions){
    el("txRows").innerHTML = transactions.slice(0, 8).map(t => `<div class="tx-row"><span>${t.trade_date}</span><b>${t.symbol}</b><small>${t.trade_type}</small><em>${fmt2(t.net_amount)} ${t.currency}</em></div>`).join("") || `<p class="empty">尚無交易流水</p>`;
  }
  function bindTabs(){
    document.querySelectorAll("[data-tab]").forEach(btn => btn.addEventListener("click", () => {
      document.querySelectorAll("[data-tab]").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active"); el(btn.dataset.tab).classList.add("active");
    }));
  }
  async function renderAuthStatus(){
    const box = el("authBox");
    if(!box || !window.IW_AUTH) return;
    const auth = await window.IW_AUTH.getAuthUser();
    if(auth?.user){
      box.innerHTML = `<div class="auth-card signed"><div><small>Google 身分</small><b>${auth.user.email || auth.user.id}</b><span>UUID：${auth.user.id}</span></div><div class="auth-actions"><button id="linkWorkspaceBtn">綁定 Workspace 001</button><button id="signOutBtn">登出</button></div></div>`;
    }else{
      box.innerHTML = `<div class="auth-card"><div><small>SaaS Identity</small><b>尚未登入</b><span>登入後將以 Supabase Auth UUID 讀取對應資料。</span></div><button id="googleSignInBtn">使用 Google 登入</button></div>`;
    }
  }

  async function boot(){
    bindTabs();
    await renderAuthStatus(); setText("productName", cfg.productName); setText("productSub", cfg.subtitle); setText("version", `v${cfg.version}`); setText("workspace", `${cfg.workspaceUser} · Workspace ${cfg.workspaceId}`); setText("status", "連線 Supabase 中…");
    try{ const data = await window.IW_API.loadWorkspace(); renderKpis(summarize(data.positions)); renderPositions(data.positions); renderHealth(data); renderTransactions(data.transactions); setText("status", `已同步：${new Date().toLocaleString("zh-TW")}`); }
    catch(err){ console.error(err); setText("status", `讀取失敗：${err.message}`); el("errorBox").textContent = err.message; el("errorBox").style.display = "block"; }
  }
  window.IW_UI = { boot };
})();
