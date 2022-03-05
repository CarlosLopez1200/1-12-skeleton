var cacheName = 'weatherPWA-v1';
var filesToCache = [
    '/',
    '/public/index.html',
    '/public/app.js',
    '/scripts/localforage-1.4.0.js',
    '/public/ud811.css',
    '/public/images/clear.png',
    '/public/images/cloudy-scattered-showers.png',
    '/public/images/cloudy.png',
    '/public/images/fog.png',
    '/public/images/ic_add_white_24px.svg',
    '/public/images/ic_refresh_white_24px.svg',
    '/public/images/partly-cloudy.png',
    '/public/images/rain.png',
    '/public/images/scattered-showers.png',
    '/public/images/sleet.png',
    '/public/images/snow.png',
    '/public/images/thunderstorm.png',
    '/public/images/wind.png'
];

/* This service worker installs anda waits to save the entire
app shell and save it the cache so that the application can work offline */

self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

/* This service worker is activated and then waits to delete
all the old cache that remains stored in the service worker */

self.addEventListener('activate',function(e){
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList){
            return Promise.all(keyList.map(function(key){
                if( key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

/* This service worker makes a request for something that is online
and with the respond with we can handle the request manually */

self.addEventListener('fetch', function(e){
    console.log('[ServiceWorker] fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response){
            return response || fetch(e.request);
        })
    );
});