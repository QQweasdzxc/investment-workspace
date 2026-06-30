(function(){
  const cfg = window.IW_CONFIG;

  function authHeaders(accessToken){
    return {
      apikey: cfg.supabaseAnonKey,
      Authorization: `Bearer ${accessToken || cfg.supabaseAnonKey}`,
      "Content-Type": "application/json"
    };
  }

  function getStoredSession(){
    try { return JSON.parse(localStorage.getItem("iw_auth_session") || "null"); }
    catch(e){ return null; }
  }

  function setStoredSession(session){
    localStorage.setItem("iw_auth_session", JSON.stringify(session));
  }

  function clearStoredSession(){
    localStorage.removeItem("iw_auth_session");
  }

  function getAccessTokenFromHash(){
    const hash = new URLSearchParams(location.hash.replace(/^#/, ""));
    const access_token = hash.get("access_token");
    const refresh_token = hash.get("refresh_token");
    const expires_in = hash.get("expires_in");
    if(access_token){
      const session = { access_token, refresh_token, expires_at: Date.now() + (Number(expires_in || 3600) * 1000) };
      setStoredSession(session);
      history.replaceState(null, "", location.pathname + location.search);
      return session;
    }
    return null;
  }

  function getSession(){
    return getAccessTokenFromHash() || getStoredSession();
  }

  function signInWithGoogle(){
    const redirectTo = location.origin + location.pathname;
    const url = `${cfg.supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
    location.href = url;
  }

  function signOut(){
    clearStoredSession();
    location.reload();
  }

  async function getAuthUser(){
    const session = getSession();
    if(!session?.access_token) return null;
    const res = await fetch(`${cfg.supabaseUrl}/auth/v1/user`, { headers: authHeaders(session.access_token) });
    if(!res.ok) return null;
    const user = await res.json();
    return { user, session };
  }

  async function linkWorkspace(userCode="001"){
    const auth = await getAuthUser();
    if(!auth) throw new Error("尚未登入 Google");
    const meta = auth.user.user_metadata || {};
    const body = {
      target_user_code: userCode,
      target_email: auth.user.email || null,
      target_display_name: meta.full_name || meta.name || auth.user.email || "User",
      target_avatar_url: meta.avatar_url || null,
      target_provider: "google"
    };
    const res = await fetch(`${cfg.supabaseUrl}/rest/v1/rpc/link_workspace_identity`, {
      method: "POST",
      headers: authHeaders(auth.session.access_token),
      body: JSON.stringify(body)
    });
    if(!res.ok){
      const txt = await res.text().catch(()=>"");
      throw new Error(`身份綁定失敗：${txt || res.statusText}`);
    }
    return await res.json();
  }

  window.IW_AUTH = { getSession, getAuthUser, signInWithGoogle, signOut, linkWorkspace };
})();
