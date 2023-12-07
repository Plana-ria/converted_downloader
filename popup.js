chrome.windows.create({
    type: 'popup',
    url: 'converted_downloader.html',
    width: 800,
    height: 600
}, function(window) {
    setTimeout(function() {
        chrome.windows.update(window.id, { focused: true });
    }, 500); // 500ミリ秒後にフォーカスを移す（適切な時間を調整してください）
});
