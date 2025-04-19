// sw.js
const CACHE_NAME = 'emote-buddy-videos';
const VIDEO_FILES = [
    'assets/videos/angry.mp4',
    'assets/videos/cookie.mp4',
    'assets/videos/crying.mp4',
    'assets/videos/default.mp4',
    'assets/videos/distracted.mp4',
    'assets/videos/glitch.mp4',
    'assets/videos/headlights.mp4',
    'assets/videos/laugh.mp4',
    'assets/videos/look_down.mp4',
    'assets/videos/look_left.mp4',
    'assets/videos/look_right.mp4',
    'assets/videos/love.mp4',
    'assets/videos/music.mp4',
    'assets/videos/police.mp4',
    'assets/videos/pong.mp4',
    'assets/videos/rainbow.mp4',
    'assets/videos/raspberry.mp4',
    'assets/videos/revs.mp4',
    'assets/videos/sakura.mp4',
    'assets/videos/shrink.mp4',
    'assets/videos/sleepy.mp4',
    'assets/videos/smile.mp4',
    'assets/videos/smirk.mp4',
    'assets/videos/sneeze.mp4',
    'assets/videos/squint.mp4',
    'assets/videos/stars.mp4',
    'assets/videos/turbo.mp4',
    'assets/videos/upside_down.mp4',
    'assets/videos/uwu.mp4'
];

// Install event: Cache videos only if not already cached
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async cache => {
                console.log('Checking and caching videos...');
                // Check each video and cache only if missing
                for (const file of VIDEO_FILES) {
                    const cachedResponse = await cache.match(file);
                    if (!cachedResponse) {
                        try {
                            const response = await fetch(file);
                            if (response.ok) {
                                await cache.put(file, response);
                                console.log(`Cached: ${file}`);
                            } else {
                                console.warn(`Failed to fetch ${file}`);
                            }
                        } catch (error) {
                            console.error(`Error caching ${file}:`, error);
                        }
                    } else {
                        console.log(`Already cached: ${file}`);
                    }
                }
            })
            .catch(error => {
                console.error('Caching failed:', error);
            })
    );
});

// Fetch event: Serve from cache, fetch and cache if not found
self.addEventListener('fetch', event => {
    if (event.request.url.includes('assets/videos')) {
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetch(event.request)
                        .then(response => {
                            if (!response || response.status !== 200) {
                                return response;
                            }
                            // Cache the new response
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => {
                                    cache.put(event.request, responseToCache);
                                });
                            return response;
                        })
                        .catch(error => {
                            console.error('Fetch failed:', error);
                            throw error;
                        });
                })
        );
    }
});

// Activate event: No cache cleanup
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim()); // Take control immediately
});