export const getTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
}

export const setTheme = (theme: 'light' | 'dark') => {
  if (typeof window === 'undefined') return
  
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

export const toggleTheme = () => {
  const current = getTheme()
  setTheme(current === 'dark' ? 'light' : 'dark')
  return current === 'dark' ? 'light' : 'dark'
}

export const initTheme = () => {
  if (typeof window === 'undefined') return
  const theme = getTheme()
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  }
}
