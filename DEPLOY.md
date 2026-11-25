# Deploying `sanctuary.myagentohana.com`

**Status:** Pending Shaka's explicit blessing on the local preview before any repo creation, push, or DNS change.

## 1. Verified current hosting architecture (`myagentohana.com` & sibling doors)
Read-only DNS and HTTP header checks run on 25 November 2026 confirm:

- **DNS provider:** Cloudflare (`darwin.ns.cloudflare.com`, `jocelyn.ns.cloudflare.com`).
- **Root domain (`myagentohana.com`):**
  - Resolves to Cloudflare proxy IPs (`104.21.68.120`, `172.67.195.85`).
  - HTTP responses carry both `server: cloudflare` and GitHub Pages origin headers (`x-github-request-id`, `via: 1.1 varnish`).
  - GitHub Pages origin repo: `shakaleikaumaka/my-agent-ohana` (`gh-pages` branch, root `/`, `CNAME` = `myagentohana.com`, `https_enforced: false` on GitHub because Cloudflare fronts TLS).
- **Sibling custom-domain doors:**
  - `pretty.agentohana.org` → `ShakaLei/pretty-paper` (`main` branch, `CNAME: pretty.agentohana.org`, GitHub Pages).
  - `osodaomeet.opensourceorchestra.org` → `Open-Source-Orchestra/oso-dao-meet` (`main` branch, `CNAME: osodaomeet.opensourceorchestra.org`, Cloudflare DNS + GitHub Pages).

## 2. Proposed deployment target
- **Recommended repository:** `shakaleikaumaka/sanctuary-myagentohana` (keeps all `*.myagentohana.com` sites under the `shakaleikaumaka` owner alongside `my-agent-ohana`).
  - Alternatives if preferred: `Open-Source-Orchestra/ohana-sanctuary` or `ShakaLei/sanctuary-myagentohana`.
- **Branch & folder:** `main` branch, `/` (root).
- **Files already included for GitHub Pages:**
  - `CNAME` (`sanctuary.myagentohana.com`)
  - `.nojekyll` (prevents Jekyll processing)
  - `robots.txt`

## 3. Exact DNS record needed in Cloudflare (Shaka action)
In the Cloudflare dashboard for the `myagentohana.com` zone, add:

| Type | Name | Target | Proxy status |
|---|---|---|---|
| `CNAME` | `sanctuary` | `shakaleikaumaka.github.io` *(use `open-source-orchestra.github.io` or `shakalei.github.io` if hosted under one of those owners instead)* | Start **DNS only** (grey cloud) until GitHub Pages finishes domain + TLS verification; then optionally switch to **Proxied** (orange cloud) with SSL/TLS mode **Full (strict)**. |

*(Optional: If you use GitHub domain verification for `myagentohana.com`, keep the existing TXT record intact.)*

## 4. Exact GitHub Pages steps (after Shaka approves)
1. Create the repository (e.g., `shakaleikaumaka/sanctuary-myagentohana`, public, GPL-3.0 / CC BY-SA 4.0).
2. Push this local git repo (`main` branch) to `origin`.
3. Enable GitHub Pages:
   - **Source:** Deploy from a branch → `main` / `/ (root)`.
   - **Custom domain:** `sanctuary.myagentohana.com` (read automatically from `CNAME`).
   - Wait for DNS check to pass, then enable **Enforce HTTPS** on GitHub Pages (especially before enabling Cloudflare orange-cloud proxy with Full (strict)).
4. Verify live HTTP 200 and TLS certificate at `https://sanctuary.myagentohana.com`.

## 5. What Groka (`gh` login `ShakaLei`) can vs. cannot do
- **Groka's `gh` login (`ShakaLei`) CAN (only after Shaka's go):**
  - Push code to existing repos where `ShakaLei` already has `push`/`admin` access (`shakaleikaumaka/my-agent-ohana`, `Open-Source-Orchestra/oso-dao-meet`, `ShakaLei/*`).
  - Create and push a repo under `ShakaLei/*` (and configure GitHub Pages via API), or push to `shakaleikaumaka/sanctuary-myagentohana` once that repo exists or if `ShakaLei` is authorized to create repos under `shakaleikaumaka`.
  - Note: the current shell `GITHUB_TOKEN` environment variable is a fine-grained PAT; the stored OAuth token in `~/.config/gh/hosts.yml` has `repo`, `read:org`, `gist`, `workflow` scopes for `ShakaLei`.
- **Shaka MUST do:**
  1. **Bless this preview** and choose the repository owner/name (`shakaleikaumaka/sanctuary-myagentohana`, `Open-Source-Orchestra/ohana-sanctuary`, or `ShakaLei/sanctuary-myagentohana`).
  2. **Add the `CNAME` record in Cloudflare** for `sanctuary.myagentohana.com` (Groka has no Cloudflare access).
  3. **Create the repo (if under `shakaleikaumaka` / `Open-Source-Orchestra` and `ShakaLei` lacks org repo-create rights)** and grant push access if needed.
