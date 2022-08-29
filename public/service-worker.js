importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js"
);

self.__WB_DISABLE_DEV_LOGS = true;

// eslint-disable-next-line no-undef
workbox.routing.registerRoute(
  ({ request }) => request.destination === "image",
  // eslint-disable-next-line no-undef
  new workbox.strategies.NetworkFirst()
);
