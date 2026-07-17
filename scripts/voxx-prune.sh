#!/usr/bin/env bash
# Prune the 37 component entry points that cfp.dev does not use.
# Evidence and method: docs/CFP-COMPONENT-AUDIT.md
#
# Usage:
#   scripts/voxx-prune.sh          # dry run: show what would be removed
#   scripts/voxx-prune.sh --write  # git rm the directories
set -euo pipefail
cd "$(dirname "$0")/.."

WRITE=${1:-}

DELETE=(
    animateonscroll blockui breadcrumb buttongroup carousel cascadeselect
    confirmpopup contextmenu divider dock dragdrop fieldset galleria iftalabel
    image imagecompare inplace inputotp keyfilter knob megamenu menubar
    organizationchart overlaybadge panelmenu picklist scrolltop skeleton
    speeddial stepper terminal textarea timeline toolbar tree treeselect
    treetable
)

remove() {
    local path=$1
    [ -e "$path" ] || return 0
    if [ "$WRITE" = "--write" ]; then
        git rm -rq "$path"
    else
        echo "would remove: $path"
    fi
}

for c in "${DELETE[@]}"; do
    remove "packages/primeng/src/$c"     # library entry point
    remove "apps/showcase/doc/$c"        # showcase doc snippets
    remove "apps/showcase/pages/$c"      # showcase route page
done

echo
echo "Remaining references to deleted components (fix by hand — routes, menus, demos):"
pattern=$(IFS='|'; echo "${DELETE[*]}")
grep -rInE "primeng/($pattern)['\"]|/(${pattern})['\"]" apps/showcase/router apps/showcase/app apps/showcase/assets 2>/dev/null | grep -vE '\.(png|svg)' || echo "  (none found)"

echo
echo "Then verify: pnpm run build:lib && pnpm run test:unit && pnpm run build:showcase"
