(function(){
  const cfg = window.IW_CONFIG;
  const headers = {
    apikey: cfg.supabaseAnonKey,
    Authorization: `Bearer ${cfg.supabaseAnonKey}`,
    "Content-Type": "application/json"
  };
  async function request(path){
    const url = `${cfg.supabaseUrl}/rest/v1/${path}`;
    const res = await fetch(url, { headers });
    if(!res.ok){
      const txt = await res.text().catch(()=>"");
      throw new Error(`Supabase ${res.status}: ${txt || res.statusText}`);
    }
    return await res.json();
  }
  async function getUser(){
    const rows = await request(`app_users?select=id,user_code,display_name,email&user_code=eq.${encodeURIComponent(cfg.workspaceId)}&limit=1`);
    if(!rows.length) throw new Error(`找不到 Workspace ${cfg.workspaceId}`);
    return rows[0];
  }
  async function getPortfolio(userId){
    const rows = await request(`portfolios?select=id,name,base_currency,is_default&user_id=eq.${userId}&is_default=eq.true&limit=1`);
    if(!rows.length) throw new Error("找不到預設投資組合");
    return rows[0];
  }
  async function getPositions(userId, portfolioId){
    return await request(`current_positions_view?select=*&user_id=eq.${userId}&portfolio_id=eq.${portfolioId}&order=market.asc,symbol.asc`);
  }
  async function getTransactions(userId, portfolioId){
    return await request(`transactions?select=trade_date,trade_type,symbol,name,quantity,price,gross_amount,fee,tax,net_amount,currency,note&user_id=eq.${userId}&portfolio_id=eq.${portfolioId}&order=trade_date.desc&limit=20`);
  }
  async function getWatchlists(userId){
    return await request(`watchlists?select=symbol,name,market,status,research_theme,reason,importance,created_at&user_id=eq.${userId}&order=created_at.desc`);
  }
  async function loadWorkspace(){
    const user = await getUser();
    const portfolio = await getPortfolio(user.id);
    const [positions, transactions, watchlists] = await Promise.all([
      getPositions(user.id, portfolio.id),
      getTransactions(user.id, portfolio.id),
      getWatchlists(user.id)
    ]);
    return { user, portfolio, positions, transactions, watchlists, loadedAt: new Date().toISOString() };
  }
  window.IW_API = { loadWorkspace };
})();
