# Pushing to GitHub from a Claude session — the method A7 uses

Written 26 September 2026 from the A7 session (`github.com/croix18/croix18-windy-hill-a7`,
branch `main`) for another session that needs to do the same thing. The conventional routes —
`gh auth login`, an SSH key, or a token in the remote URL — do **not** work here. This does.

## 1. Why the normal way fails

- There is no interactive login and no SSH key in a session sandbox.
- Git sends its first request **without** credentials and waits for a `401` challenge before
  offering them. The sandbox proxy answers that first request with **403**, so git gives up and
  never sends the token. The symptom is `could not read Username for 'https://github.com':
  terminal prompts disabled`, or a bare `error: 403`.
- Putting the token in the remote URL fails for the same reason, and it leaks the token into
  `.git/config`.
- `api.github.com/repos/...` is blocked per repository by the proxy no matter what token you
  hold, so do not diagnose with the API. (`api.github.com/user` returns 200 and tells you
  nothing about repo access.)

## 2. What works: send Basic auth preemptively, per command

```sh
T=$(tr -d '[:space:]' < .github-token)
B=$(printf 'x-access-token:%s' "$T" | base64 -w0)
git -c "http.https://github.com/.extraheader=Authorization: Basic $B" push origin main
```

Basic, not Bearer — GitHub's git endpoints want Basic. Use the same `-c http...extraheader`
form for `ls-remote`, `fetch` and `clone`. Because it is passed with `-c`, it never lands in
`.git/config`.

## 3. The token

- Fine-grained personal access token: **Only select repositories** → the one repo;
  **Contents: Read and write**. Nothing else is needed.
- Keep it in `.github-token` at the repo root, `chmod 600`, and put `.github-token` in
  `.gitignore` **before the first commit**. Never in the remote URL, never echoed to output,
  never in a commit message.
- Rotate it when the work is done if it was ever pasted into a chat.

## 4. Commit identity and trailers

A commit authored with the gmail address is rejected: *push declined due to email privacy
restrictions*. Author as the GitHub no-reply address instead:

```
Croix Shaffer <268190892+croix18@users.noreply.github.com>
```

The session adds its own trailers, taken from environment variables so no session has to edit
the script:

```sh
CLAUDE_MODEL_NAME="Claude Opus 5" \
CLAUDE_SESSION_URL="https://claude.ai/code/session_xxxxxxxx" \
tools/push.sh "the commit message"
```

which produces `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` and a `Claude-Session:`
line at the end of the message.

## 5. Trust the remote, not the push output

A push that actually succeeded can still print the "could not read Username" line (git retries
on its second request). So every push ends by comparing the remote head with the local head and
failing loudly if they differ. Never report "pushed" without that check.

```sh
git -c "http.https://github.com/.extraheader=Authorization: Basic $B" ls-remote origin main | cut -f1
git rev-parse HEAD
```

## 6. The whole script — `tools/push.sh`

```sh
#!/usr/bin/env bash
# Commit everything and push to GitHub from inside a Claude session.
# Why the header: the sandbox proxy answers git's first (unauthenticated) request with 403
# instead of 401, so git never offers credentials. Sending Basic auth preemptively works.
# Token lives in .github-token (git-ignored, chmod 600). Never put it in the remote URL.
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f .github-token ] || { echo "no .github-token" >&2; exit 1; }
T=$(tr -d '[:space:]' < .github-token)
B=$(printf 'x-access-token:%s' "$T" | base64 -w0)
MSG=${1:-"Update"}
COAUTHOR=${CLAUDE_MODEL_NAME:-"Claude Opus 5"}
TRAILER="Co-Authored-By: $COAUTHOR <noreply@anthropic.com>"
[ -n "${CLAUDE_SESSION_URL:-}" ] && TRAILER="$TRAILER
Claude-Session: $CLAUDE_SESSION_URL"
git add -A
if ! git diff --cached --quiet; then
  git -c user.name="Croix Shaffer" -c user.email="268190892+croix18@users.noreply.github.com" \
    commit -q -m "$MSG

$TRAILER"
fi
git -c "http.https://github.com/.extraheader=Authorization: Basic $B" push -q origin main 2>&1 | grep -v "acknowledgments\|push negotiation" || true
# Trust the remote, not the message.
REMOTE=$(git -c "http.https://github.com/.extraheader=Authorization: Basic $B" ls-remote origin main | cut -f1)
LOCAL=$(git rev-parse HEAD)
if [ "$REMOTE" = "$LOCAL" ]; then echo "pushed: $LOCAL"; else echo "PUSH FAILED: remote $REMOTE local $LOCAL" >&2; exit 1; fi
```

## 7. If a push fails, one probe tells you whether it is the token

```sh
curl -s -o /dev/null -w "%{http_code}\n" -u "x-access-token:$T" \
  "https://github.com/<owner>/<repo>.git/info/refs?service=git-receive-pack"
```

- `200` — the token can push; the problem is something else.
- `401` — the token cannot reach that repo: wrong repository selected on the fine-grained
  token, Contents not set to read and write, or it was revoked. Ask for a new one rather than
  debugging.

## 8. Things A7 learned after the basics worked

- **Office files churn.** Rebuilding a unit rewrites every .docx/.pptx/.pdf even when nothing
  changed, because of timestamps inside the files, so `git add -A` stages hundreds of files.
  Before committing a rebuild, compare *content*: for .docx/.pptx unzip and compare all parts
  except `docProps/`, and for .pdf compare extracted page text. Then
  `git checkout HEAD -- <the timestamp-only files>` so the commit holds only real changes. A
  one-word label fix in a lesson should be 28 files, not 286.
- **Two commits when a generated file records its own provenance.** The master spreadsheet
  stamps the commit it was built from, so: commit the sources, rebuild the file, commit the
  file. Otherwise it cites a commit that does not contain its inputs.
- **Binaries are tracked directly** — no LFS. Build scratch is git-ignored
  (`a7/build/out/**/*.pdf`), package outputs are tracked.
- **No GitHub Releases from a session.** Creating one goes through the API and is refused as an
  external-system write; it needs Croix to do it in the browser.
