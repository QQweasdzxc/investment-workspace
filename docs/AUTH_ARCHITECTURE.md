# Auth Architecture - V9.2

## Goal
使用 Supabase Auth UUID 作為 SaaS 身分主鍵。

## Flow
Google Login → Supabase Auth user.id(UUID) → app_users.auth_user_id → portfolios / positions / transactions

## Current State
- `app_users.auth_user_id` 已存在。
- V9.2 新增 `link_workspace_identity()` RPC。
- V9.2 新增 `my_workspace_view`。
- Phase 1 仍保留 Bootstrap 開放政策，避免登入尚未完整前中斷現有使用。

## Next Step
設定 Supabase Google OAuth Provider 後，使用者登入並綁定 Workspace 001。
確認成功後，移除 phase1 open policies，改成嚴格 RLS。
