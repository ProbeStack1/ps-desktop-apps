// #!/usr/bin/env node  (disabled for Windows PowerShell compatibility)
/**
 * build.js
 * ─────────
 * Builds a standalone installable for one app from apps.config.js
 *
 * Usage:
 *   node build.js --app=forgeq  [--platform=mac|win|linux|all]
 *   node build.js --app=forgestudio
 *
 * Outputs go to: dist/<appKey>/
 */

const builder = require('electron-builder');
const path = require('path');
const appsConfig = require('./apps.config');

// ── Parse CLI args ─────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => a.slice(2).split('='))
);

const appKey = args.app;
const platform = args.platform || 'all';

if (!appKey) {
  console.error('\n❌  Please specify an app:  node build.js --app=forgeq\n');
  console.error('   Available:', Object.keys(appsConfig).join(', '), '\n');
  process.exit(1);
}

const cfg = appsConfig[appKey];
if (!cfg) {
  console.error(`\n❌  Unknown app key: "${appKey}"`);
  console.error('   Available:', Object.keys(appsConfig).join(', '), '\n');
  process.exit(1);
}

console.log(`\n🔨  Building: ${cfg.name}  (${appKey})`);
console.log(`    URL:      ${cfg.url}`);
console.log(`    Platform: ${platform}\n`);

// ── Resolve targets ────────────────────────────────────────────
function getTargets() {
  switch (platform) {
    case 'mac': return builder.Platform.MAC.createTarget();
    case 'win': return builder.Platform.WINDOWS.createTarget();
    case 'linux': return builder.Platform.LINUX.createTarget();
    default:
      return new Map([
        ...builder.Platform.MAC.createTarget(),
        ...builder.Platform.WINDOWS.createTarget(),
        ...builder.Platform.LINUX.createTarget(),
      ]);
  }
}

// ── electron-builder config ────────────────────────────────────
const buildConfig = {
  appId: cfg.appId,
  productName: cfg.name,
  copyright: `Copyright © ${new Date().getFullYear()} ${cfg.name}`,

  extraMetadata: {
    name: cfg.name,
  },

  directories: {
    output: path.join('dist', appKey),
  },

  files: [
    'main.js',
    'apps.config.js',
    `assets/${appKey}/**/*`,
    'node_modules/**/*',
  ],

  // macOS (ZIP → stable in CI)
  mac: {
    category: 'public.app-category.productivity',
    target: ['zip'],
    icon: cfg.icon.mac,
  },

  // Windows
  win: {
    target: [{ target: 'nsis', arch: ['x64'] }],
    icon: cfg.icon.win,
  },

  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    installerHeaderIcon: cfg.icon.win,
    deleteAppDataOnUninstall: false,
  },

  // Linux
  linux: {
    target: ['AppImage', 'deb'],
    icon: cfg.icon.linux,
    category: 'Development',
  },
};

// ── Run build ──────────────────────────────────────────────────
builder.build({
  targets: getTargets(),
  config: buildConfig,
  publish: "never",   // ✅ CRITICAL FIX (prevents GitHub auto-publish errors)
})
  .then((files) => {
    console.log('\n✅  Build complete!\n');
    files.forEach(f => console.log('   ', f));
    console.log();
  })
  .catch((err) => {
    console.error('\n❌  Build failed:\n', err.message || err);
    process.exit(1);
  });