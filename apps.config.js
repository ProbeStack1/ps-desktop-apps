// ─────────────────────────────────────────────────────────────
//  APPS CONFIG
//  Add or edit apps here. Each entry produces its own
//  installable .dmg / .exe / .AppImage when you run:
//    npm run build -- --app=forgeq
//    npm run build -- --app=forgestudio
// ─────────────────────────────────────────────────────────────

module.exports = {
  forgeq: {
    name: 'ForgeQ',
    url: 'https://forgeq.probestack.io',
    color: '#FF6B35',
    appId: 'io.probestack.forgeq',
    description: 'ForgeQ by Probestack',
    icon: {
      mac: 'assets/forgeq/probestack-logo-desktop.png',
      win: 'assets/forgeq/probestack-logo-desktop.png',
      linux: 'assets/forgeq/probestack-logo-desktop.png',
    },
  },

  forgestudio: {
    name: 'Forge Studio',
    url: 'https://forgestudio.probestack.io',
    color: '#6C63FF',
    appId: 'io.probestack.forgestudio',
    description: 'Forge Studio by Probestack',
    icon: {
      mac: 'assets/forgestudio/probestack-logo-desktop.png',
      win: 'assets/forgestudio/probestack-logo-desktop.png',
      linux: 'assets/forgestudio/probestack-logo-desktop.png',
    },
  },

  // Add more apps here:
  // myapp: {
  //   name: 'My App',
  //   url: 'https://myapp.example.com',
  //   color: '#00C896',
  //   appId: 'com.example.myapp',
  //   description: 'My App description',
  //   icon: { mac: 'assets/myapp/icon.icns', win: 'assets/myapp/icon.ico', linux: 'assets/myapp/icon.png' },
  // },
};
