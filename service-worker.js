const CACHE='obrd-hybrid-v1';
const urls=[
  '/', '/index.html','/manifest.json',
  'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs',
  'https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd',
  'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet',
  'https://cdn.jsdelivr.net/npm/@tensorflow-models/efficientdet'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(urls)));
});
self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
