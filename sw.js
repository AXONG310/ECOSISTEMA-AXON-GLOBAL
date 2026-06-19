// ============================================================================
// AXON GLOBAL - SERVICE WORKER (PWA MOTOR)
// Archivo: sw.js
// ============================================================================

const CACHE_NAME = 'axon-global-cache-v1';

// 1. INSTALACIÓN: Cuando el usuario instala la App en su celular
self.addEventListener('install', (event) => {
    console.log('[Axon SW] Instalación de la App Móvil completada con éxito.');
    // Obliga al Service Worker a activarse inmediatamente
    self.skipWaiting();
});

// 2. ACTIVACIÓN: Limpieza de cachés antiguos si actualizamos la App
self.addEventListener('activate', (event) => {
    console.log('[Axon SW] Motor Móvil activado y operando en el dispositivo.');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Axon SW] Purgando caché antiguo:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    // Toma el control de todos los clientes (pestañas) inmediatamente
    return self.clients.claim();
});

// 3. INTERCEPTOR DE RED (FETCH): Mantiene la app viva y no interfiere con los pagos
self.addEventListener('fetch', (event) => {
    // Usamos una estrategia "Network First" (Primero la red). 
    // Esto asegura que los videos, los chats de IA y la pasarela de pagos siempre funcionen en tiempo real.
    // Si falla la red (el usuario entra a un túnel sin señal), no mostramos el error del dinosaurio de Google.
    event.respondWith(
        fetch(event.request).catch(() => {
            console.log('[Axon SW] El usuario está operando sin conexión a Internet.');
            // Aquí podríamos devolver una página offline pre-cargada si la tuviéramos
        })
    );
});