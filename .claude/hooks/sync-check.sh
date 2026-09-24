#!/bin/bash
# Session-start sync report. Runs on the Mac and in cloud sessions alike.
# It never changes anything: no pull, no merge, no deploy. It only tells Claude
# (and you) whether this copy is behind GitHub, has unpushed or uncommitted work,
# or whether another session left work on a branch that never reached main.
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
MAIN=$(git symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null | sed 's#^origin/##')
MAIN=${MAIN:-main}
say() { printf '%s\n' "$1"; }

# Refresh remote refs. A slow or missing network must not hold up the session.
# macOS has no `timeout`, so a watcher kills the fetch after 10 seconds instead.
FETCHED=yes
git fetch --quiet --prune origin 2>/dev/null &
FETCH_PID=$!
( sleep 10; kill "$FETCH_PID" ) >/dev/null 2>&1 &
WATCH_PID=$!
wait "$FETCH_PID" || FETCHED=no
kill "$WATCH_PID" 2>/dev/null
wait "$WATCH_PID" 2>/dev/null

where="Mac"
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] && where="cloud"
say "Sync check ($where), branch $BRANCH"
[ "$FETCHED" = no ] && say "  ? could not reach GitHub, so the comparison below may be stale"

# This branch against its own copy on GitHub.
UP="origin/$BRANCH"
if git rev-parse --verify --quiet "$UP" >/dev/null; then
  read -r BEHIND AHEAD < <(git rev-list --left-right --count "$UP...HEAD" 2>/dev/null | tr '\t' ' ')
  BEHIND=${BEHIND:-0}; AHEAD=${AHEAD:-0}
  [ "$BEHIND" != 0 ] && say "  ! $BEHIND commit(s) behind $UP. Run: git pull --ff-only origin $BRANCH"
  [ "$AHEAD" != 0 ] && say "  ! $AHEAD commit(s) not pushed. Run: git push origin $BRANCH"
  [ "$BEHIND" = 0 ] && [ "$AHEAD" = 0 ] && say "  - in sync with $UP"
else
  say "  ? $BRANCH is not on GitHub yet"
fi

# On a side branch, say how far main has moved on.
if [ "$BRANCH" != "$MAIN" ] && git rev-parse --verify --quiet "origin/$MAIN" >/dev/null; then
  N=$(git rev-list --count "HEAD..origin/$MAIN" 2>/dev/null)
  [ "${N:-0}" != 0 ] && say "  ! origin/$MAIN has $N commit(s) this branch doesn't. Merge or rebase before building on it"
fi

DIRTY=$(git status --porcelain | wc -l | tr -d ' ')
[ "$DIRTY" != 0 ] && say "  ! $DIRTY uncommitted file(s)"

# Work another session pushed to a branch but never merged into main.
# This is how a phone or cloud session's changes go missing. A branch whose PR was
# merged (squash merges leave the commits looking unmerged) or closed is skipped;
# so is one whose changes are already in main.
PRS=""
if command -v gh >/dev/null 2>&1; then
  PRS=$(gh pr list --state all --limit 200 --json headRefName,state,number \
        --jq '.[] | "\(.headRefName) \(.state) \(.number)"' 2>/dev/null)
fi
MAIN_TREE=$(git rev-parse "origin/$MAIN^{tree}" 2>/dev/null)
git for-each-ref --format='%(refname:short)' refs/remotes/origin 2>/dev/null |
  grep -vE "^origin(/HEAD|/$MAIN)?$" | while read -r ref; do
    b=${ref#origin/}
    [ "$b" = "$BRANCH" ] && continue
    N=$(git rev-list --count "origin/$MAIN..$ref" 2>/dev/null)
    [ "${N:-0}" = 0 ] && continue
    PR=$(printf '%s\n' "$PRS" | awk -v b="$b" '$1==b && $2=="OPEN" {print $3; exit}')
    if [ -z "$PR" ] && printf '%s\n' "$PRS" | awk -v b="$b" '$1==b {f=1} END {exit !f}'; then
      continue   # its PR was merged or closed
    fi
    [ "$(git merge-tree --write-tree "origin/$MAIN" "$ref" 2>/dev/null | head -1)" = "$MAIN_TREE" ] && continue
    WHEN=$(git log -1 --format='%cr' "$ref" 2>/dev/null)
    if [ -n "$PR" ]; then
      say "  ! $ref has open PR #$PR (last commit $WHEN). Ask whether to merge it"
    else
      say "  ! $ref has $N commit(s) not in $MAIN and no PR (last $WHEN). Read it and ask whether to merge"
    fi
  done

VERSION=$(sed -n "s/.*VERSION *= *['\"]\([^'\"]*\)['\"].*/\1/p" src/version.js 2>/dev/null | head -1)
[ -n "$VERSION" ] && say "  - code version v$VERSION"

# Deploy staleness, for projects whose deploy script records the commit it shipped.
MARKER=.claude/.last-deploy
if [ -f "$MARKER" ]; then
  LAST=$(tr -d '[:space:]' < "$MARKER" 2>/dev/null)
  if git cat-file -e "$LAST^{commit}" 2>/dev/null; then
    N=$(git rev-list --count "$LAST..HEAD" -- . ':!*.md' ':!.claude' 2>/dev/null)
    if [ "${N:-0}" != 0 ]; then say "  ! $N code commit(s) since the last recorded deploy"
    else say "  - last recorded deploy matches this code"; fi
  fi
fi

say "Read 'Current state' in CLAUDE.md before starting. Update it and push before you finish."
exit 0
