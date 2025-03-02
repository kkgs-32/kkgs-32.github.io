if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
            console.log('Service Worker registered:', reg);

            // サービスワーカーからのメッセージを受信するリスナー
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'SW_UPDATE') {
                    const version = event.data.version;
                    const message = event.data.message;
                    alert(`kkgs-32 がバージョン ${version} に更新されました。\n更新内容: ${message}`);
                }
            });

            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        //新しいsw.jsを読み込んでcache_nameとupdate_messageを取得する。
                        fetch('/sw.js').then(response => response.text()).then(text => {
                            const cacheNameMatch = text.match(/const CACHE_NAME = '(.*)';/);
                            const newCacheName = cacheNameMatch ? cacheNameMatch[1] : "不明なバージョン";
                            const updateMessageMatch = text.match(/const UPDATE_MESSAGE = "(.*)";/);
                            const newUpdateMessage = updateMessageMatch ? updateMessageMatch[1] : "更新内容はありません";
                            alert(`新しいバージョン「${newCacheName}」が利用可能です。\n更新内容:${newUpdateMessage}\n新しいバージョンを適用するために、ページを再読み込みします。`);
                            location.reload();
                        }).catch(error => {
                            console.error('Error fetching sw.js:', error);
                            alert(`新しいバージョンがあります。\n新しいバージョンを適用するために、ページを再読み込みします。`);
                            location.reload();
                        });
                    }
                });
            });
        })
        .catch((err) => console.log('Service Worker registration failed:', err));
}
