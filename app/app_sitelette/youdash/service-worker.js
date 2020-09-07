if (typeof importScripts === 'function') {
    importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');
    /* global workbox */
    if (workbox) {
        console.log('Workbox is loaded');
        workbox.core.skipWaiting();

        /* injection point for manifest files.  */
        workbox.precaching.precacheAndRoute([{"revision":"a880e9e9835cf218f4b9f20e0a77e3e0","url":"precache-manifest.a880e9e9835cf218f4b9f20e0a77e3e0.js"},{"revision":"9774aeadd542f689aef3421ced7ed580","url":"static/css/10.eb7919d9.chunk.css"},{"revision":"1c952ef1c363aa0525a029ea2215085a","url":"static/css/11.90638661.chunk.css"},{"revision":"ae7ba95c1117e4c34f8e7a90a36e074d","url":"static/css/12.90638661.chunk.css"},{"revision":"929dcb98a786ab5a87dc64f70453af00","url":"static/css/13.ddbd0f97.chunk.css"},{"revision":"789748aab964aca01bd9abcc3be6dc48","url":"static/css/14.43cd73bd.chunk.css"},{"revision":"1eb22dcb130381caf4339a238712d2e6","url":"static/css/15.070402c7.chunk.css"},{"revision":"12707bb4aa5576ed729b2a5a50283d77","url":"static/css/5.12882e96.chunk.css"},{"revision":"8c419ef10e44d4e5b88a2b044220f359","url":"static/css/8.39b5198a.chunk.css"},{"revision":"922597d1445709bb9e3326ca7456d16a","url":"static/css/9.eb7919d9.chunk.css"},{"revision":"4bf24b63448c6ca8128bee2497daee23","url":"static/css/main.ba305ced.chunk.css"},{"revision":"f5e1aa2e1784c35e960b907d40ccfdab","url":"static/js/0.d372a6e2.chunk.js"},{"revision":"31de4ecd77e84ec61c6fe9913918312c","url":"static/js/1.8ec31157.chunk.js"},{"revision":"0cf1a14f2f8dadb10f94f1dab63e4534","url":"static/js/10.d399d373.chunk.js"},{"revision":"2343ba127474c7a2aa4108b8f765b6bd","url":"static/js/11.d8b90982.chunk.js"},{"revision":"ec5f9ea8f2c6208c32412d6ac720a4a9","url":"static/js/12.e2246b16.chunk.js"},{"revision":"b219db5cd70e4fa3ea5913be5c7f8b7e","url":"static/js/13.bf7310be.chunk.js"},{"revision":"4e1d88499e6930b284ad4e14334153f5","url":"static/js/14.9570c96d.chunk.js"},{"revision":"02938371e22de24689e97f014073e193","url":"static/js/15.468e00d6.chunk.js"},{"revision":"d65fcec94707e14edd29c14440baf4de","url":"static/js/16.30fc60c9.chunk.js"},{"revision":"052c5109ad7cd855aa0d6e51225eb32f","url":"static/js/2.b1d47c48.chunk.js"},{"revision":"ef62098ed072c464e84bcf3b76ca14de","url":"static/js/5.8d810693.chunk.js"},{"revision":"29fa355410b27b3a9338a645342837c1","url":"static/js/6.8f801ae5.chunk.js"},{"revision":"65150415432ba78e640d74b8907cb589","url":"static/js/7.e94ea0b3.chunk.js"},{"revision":"c28be1a866341c04d07958485eab7995","url":"static/js/8.1e33dbad.chunk.js"},{"revision":"c3642206501b41592069fb26fbc10fa3","url":"static/js/9.53f4ca16.chunk.js"},{"revision":"9a7e992ea26046dda008bc15eb854e52","url":"static/js/main.d7dfcb67.chunk.js"},{"revision":"39138f4bdd85aeb02417b60d6cee0c9c","url":"static/js/runtime-main.b927fda1.js"}]);

        /* custom cache rules */
        workbox.routing.registerRoute(
            new workbox.routing.NavigationRoute(
                new workbox.strategies.NetworkFirst({
                    cacheName: 'PRODUCTION',
                })
            )
        );
    } else {
        // console.log('Workbox could not be loaded. No Offline support');
    }
}