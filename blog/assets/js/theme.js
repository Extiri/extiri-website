// Theme switcher based on CSS variables made by Fernardo Paredes
// https://www.fdp.io/blog/2016/11/08/theming-via-css-properties/

// Polyfilling Object.entries for Safari :/
Object.entries = (object) => Object.keys(object).map(
  (key) => [ key, object[key] ]
)

const isObject = (obj) => obj === Object(obj)

const LightTheme = {
  '--bg-color': '#050b19',
  '--bg-elevated': 'rgba(16, 26, 44, 0.82)',
  '--bg-muted': 'rgba(11, 19, 33, 0.6)',
  '--surface-card': 'rgba(11, 20, 36, 0.72)',
  '--surface-border': 'rgba(118, 178, 255, 0.22)',
  '--surface-highlight': 'rgba(28, 48, 82, 0.85)',
  '--text-color': '#e4ecff',
  '--text-color-light': 'rgba(182, 206, 240, 0.72)',
  '--link-color': '#7fe5ff',
  '--metadata-color': 'rgba(152, 192, 246, 0.72)',
  '--post-title': '#f6fbff',
  '--code-bg-color': '#081423',
  '--code-border': 'rgba(98, 146, 255, 0.22)',
  '--table-border-color': 'rgba(96, 138, 212, 0.21)',
  '--table-header-color': 'rgba(14, 24, 42, 0.88)',
  '--shadow-color': 'rgba(5, 12, 32, 0.55)',
  '--invert-logo-color': 'invert(1)',
  '--hero-heading-color': '#f2f6ff',
  '--page-highlight': 'rgba(92, 188, 255, 0.16)',
  '--button-primary': '#f4792b',
  '--button-primary-hover': '#ff9448',
  themeName: 'AuroraTheme'
}

const NightTheme = {
  '--bg-color': '#020714',
  '--bg-elevated': 'rgba(10, 18, 34, 0.9)',
  '--bg-muted': 'rgba(8, 14, 26, 0.7)',
  '--surface-card': 'rgba(8, 18, 34, 0.78)',
  '--surface-border': 'rgba(134, 194, 255, 0.3)',
  '--surface-highlight': 'rgba(40, 62, 104, 0.85)',
  '--text-color': '#dce6ff',
  '--text-color-light': 'rgba(170, 198, 236, 0.72)',
  '--link-color': '#8ff0ff',
  '--metadata-color': 'rgba(160, 200, 250, 0.72)',
  '--post-title': '#ffffff',
  '--code-bg-color': '#061024',
  '--code-border': 'rgba(124, 176, 255, 0.28)',
  '--table-border-color': 'rgba(104, 150, 220, 0.28)',
  '--table-header-color': 'rgba(12, 22, 42, 0.88)',
  '--shadow-color': 'rgba(8, 18, 40, 0.6)',
  '--invert-logo-color': 'invert(1)',
  '--hero-heading-color': '#ffffff',
  '--page-highlight': 'rgba(120, 208, 255, 0.22)',
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
