
(function(){
  const cfg=window.IW_CONFIG, SESSION_KEY="iw_auth_session_v2";
  function headers(token){return {apikey:cfg.supabaseAnonKey,Authorization:`Bearer ${token||cfg.supabaseAnonKey}`,"Content-Type":"application/json"}}
  function getStoredSession(){try{return JSON.parse(localStorage.getItem(SESSION_KEY)||"null")}catch(e){return null}}
  function setStoredSession(s){localStorage.setItem(SESSION_KEY,JSON.stringify(s))}
  function clearStoredSession(){localStorage.removeItem(SESSION_KEY)}
  function captureHashSession(){const hash=new URLSearchParams(location.hash.replace(/^#/,""));const access_token=hash.get("access_token");if(!access_token)return null;const session={access_token,refresh_token:hash.get("refresh_token"),expires_at:Date.now()+Number(hash.get("expires_in")||3600)*1000};setStoredSession(session);history.replaceState(null,"",location.pathname+location.search);return session}
  function getSession(){return captureHashSession()||getStoredSession()}
  function signInWithGoogle(){const redirectTo=location.origin+location.pathname;location.href=`${cfg.supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`}
  function signOut(){clearStoredSession();location.reload()}
  async function getAuthUser(){const session=getSession();if(!session?.access_token)return null;const res=await fetch(`${cfg.supabaseUrl}/auth/v1/user`,{headers:headers(session.access_token)});if(!res.ok){clearStoredSession();return null}const user=await res.json();return {user,session}}
  async function rpc(name,body,token){const res=await fetch(`${cfg.supabaseUrl}/rest/v1/rpc/${name}`,{method:"POST",headers:headers(token),body:JSON.stringify(body||{})});if(!res.ok){throw new Error(await res.text()||res.statusText)}return await res.json()}
  async function getWorkspaceSummary(){const auth=await getAuthUser();if(!auth)return null;const rows=await rpc("get_my_workspace_summary",{},auth.session.access_token);return {auth,rows}}
  async function claimLegacyWorkspace(){const auth=await getAuthUser();if(!auth)throw new Error("AUTH_REQUIRED");const meta=auth.user.user_metadata||{};return await rpc("claim_legacy_workspace",{target_user_code:cfg.defaultWorkspaceCode,target_email:auth.user.email||null,target_display_name:meta.full_name||meta.name||auth.user.email||"主公",target_avatar_url:meta.avatar_url||null},auth.session.access_token)}
  window.IW_AUTH={getSession,signInWithGoogle,signOut,getAuthUser,getWorkspaceSummary,claimLegacyWorkspace}
})();
