// Theme switcher based on CSS variables made by Fernardo Paredes
// https://www.fdp.io/blog/2016/11/08/theming-via-css-properties/

// Polyfilling Object.entries for Safari :/
Object.entries = (object) => Object.keys(object).map(
  (key) => [ key, object[key] ]
)

const isObject = (obj) => obj === Object(obj)

const LightTheme = {
  '--bg-color': '#f5f6fb',
  '--bg-elevated': '#ffffff',
  '--bg-muted': '#eef1f8',
  '--surface-card': '#ffffff',
  '--surface-border': 'rgba(24, 34, 56, 0.08)',
  '--surface-highlight': 'rgba(255, 111, 42, 0.12)',
  '--text-color': '#1f2530',
  '--text-color-light': 'rgba(82, 92, 110, 0.82)',
  '--link-color': '#ff6f2a',
  '--metadata-color': 'rgba(118, 126, 142, 0.7)',
  '--post-title': '#10131a',
  '--code-bg-color': '#f3f5fa',
  '--code-border': '#e0e5ef',
  '--table-border-color': '#d7dce6',
  '--table-header-color': '#f0f3fa',
  '--shadow-color': 'rgba(15, 23, 42, 0.08)',
  '--invert-logo-color': 'invert(0)',
  '--hero-heading-color': '#10131a',
  '--page-highlight': 'rgba(255, 111, 42, 0.12)',
  '--button-primary': '#ff7a23',
  '--button-primary-hover': '#ff8f43',
  themeName: 'AuroraTheme'
}

const NightTheme = {
  '--bg-color': '#0e1421',
  '--bg-elevated': '#131c2d',
  '--bg-muted': '#111726',
  '--surface-card': '#192234',
  '--surface-border': 'rgba(124, 146, 184, 0.18)',
  '--surface-highlight': 'rgba(255, 140, 72, 0.2)',
  '--text-color': '#e6ecff',
  '--text-color-light': 'rgba(182, 198, 224, 0.72)',
  '--link-color': '#ff9556',
  '--metadata-color': 'rgba(156, 176, 210, 0.65)',
  '--post-title': '#ffffff',
  '--code-bg-color': '#111a2a',
  '--code-border': 'rgba(112, 138, 184, 0.25)',
  '--table-border-color': 'rgba(124, 146, 184, 0.24)',
  '--table-header-color': 'rgba(26, 32, 48, 0.92)',
  '--shadow-color': 'rgba(0, 0, 0, 0.28)',
  '--invert-logo-color': 'invert(1)',
  '--hero-heading-color': '#ffffff',
  '--page-highlight': 'rgba(255, 140, 72, 0.22)',
  '--button-primary': '#ff8a3c',
  '--button-primary-hover': '#ffad66',
  themeName: 'NebulaTheme'
}

const setCSSVariable = (key, value) => document.body.style.setProperty(key, value)

const saveTheme = (theme) => {
  if (window.localStorage) {
    localStorage['theme'] = JSON.stringify(theme)
    localStorage['currentTheme'] = theme.themeName
  }
}

const loadSavedTheme = () => {
  if (window.localStorage) {
    const maybeTheme = localStorage['theme']
    if (maybeTheme) return JSON.parse(maybeTheme)
  }

  return null
}

const updateTheme = (theme) => {
  if (!isObject(theme)) return

  Object
  .entries(theme)
  .forEach(([key, value]) => setCSSVariable(key, value))

  saveTheme(theme)
}

const checkForSavedTheme = () => {
  const theme = loadSavedTheme()
  if (theme) updateTheme(theme)
}

const switchTheme = () => {
  const el = document.getElementById('theme-switcher')
  const theme = loadSavedTheme()
  const currentTheme = window.localStorage ? localStorage['currentTheme'] : null

  if (theme && currentTheme === NightTheme.themeName) {
    updateTheme(LightTheme)
    if (el) el.className = iconForTheme(LightTheme.themeName)
  } else {
    updateTheme(NightTheme)
    if (el) el.className = iconForTheme(NightTheme.themeName)
  }
}

const iconForTheme = (themeName) => {
  if (themeName === NightTheme.themeName) {
    return 'icon-invert_colors'
  } else {
    return 'icon-invert_colors2'
  }
}

// initiate

// set inital theme to light
updateTheme(LightTheme);
checkForSavedTheme();

const el = document.getElementById('theme-switcher');

if (el) {
  if (window.localStorage && localStorage['currentTheme']) {
    var iconClasses = iconForTheme(localStorage['currentTheme']);
    el.className = iconClasses;
  } else {
    el.className = iconForTheme();
  }
}
