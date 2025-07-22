(function () {
    'use strict';
    document.addEventListener('ready', () => {
        window.open = () => {};
        if (window.player?.pause) {
            const pause = window.player.pause;
            window.player.pause = () => {
                if (document.hasFocus()) {
                    pause();
                }
            };
        }
    });
})();
