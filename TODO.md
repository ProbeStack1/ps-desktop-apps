# Task: Fix macOS DMG build failure (hdiutil detach error) in GHA for forgeq

## Steps from approved plan:
- [x] 1. Update build.js: Change mac.target to ['zip'], remove dmg block, add publish: { provider: 'never' } ✅
- [ ] 2. Skip package.json author (optional)
- [ ] 3. Update this TODO.md as complete
- [x] 4. Commit/push changes ✅
- [x] 5. Test: git tag v1.0.6 &amp;&amp; git push --tags (triggers workflow) ✅
- [x] 6. Confirm GHA artifacts: dist/forgeq/*.zip (no .dmg) ✅

# ✅ Task complete: macOS build fixed (DMG → zip).
