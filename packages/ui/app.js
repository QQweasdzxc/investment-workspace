document.addEventListener("DOMContentLoaded", () => {
  const reloadBtn = document.getElementById("reloadBtn");
  if (reloadBtn) reloadBtn.addEventListener("click", () => location.reload());

  const signInBtn = document.getElementById("googleSignInBtn");
  if (signInBtn) signInBtn.addEventListener("click", () => window.IW_AUTH.signInWithGoogle());

  const signOutBtn = document.getElementById("signOutBtn");
  if (signOutBtn) signOutBtn.addEventListener("click", () => window.IW_AUTH.signOut());

  const linkBtn = document.getElementById("linkWorkspaceBtn");
  if (linkBtn) linkBtn.addEventListener("click", async () => {
    linkBtn.disabled = true;
    linkBtn.textContent = "綁定中…";
    try {
      await window.IW_AUTH.linkWorkspace("001");
      location.reload();
    } catch (err) {
      alert(err.message);
      linkBtn.disabled = false;
      linkBtn.textContent = "綁定 Workspace 001";
    }
  });

  window.IW_UI.boot();
});
