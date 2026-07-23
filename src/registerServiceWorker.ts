export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('Service Worker initialized successfully:', reg.scope)
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err)
        })
    })
  }
}
export default registerServiceWorker
