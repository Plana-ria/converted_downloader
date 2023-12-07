// converted_downloader.js

const { fetchFile } = FFmpegUtil;
const { FFmpeg } = FFmpegWASM;
let ffmpegInstance = null;

async function loadFFmpeg() {
    if (ffmpegInstance === null) {
        ffmpegInstance = new FFmpeg();
        ffmpegInstance.on("log", ({ message }) => {
            console.log(message);
        });
        ffmpegInstance.on("progress", ({ progress, time }) => {
            //message.innerHTML = `${progress * 100} %, time: ${time / 1000000} s`;
        });
        await ffmpegInstance.load({
            coreURL: chrome.runtime.getURL("ffmpeg.wasm/default/core/package/dist/umd/ffmpeg-core.js"),
        });
    }

    return ffmpegInstance;
}








chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "convertAndSave") {
        // content script 内の関数を呼び出す
        convertAndSave(request.data.format, request.data.type, request.data.url);
    }
});


async function convertAndSave(format, sourceType, srcUrl) {
    switch (sourceType) {
        case "image":
            jpeg_to_png(format, sourceType, srcUrl);
            break;
        case "gif":
            if (format=="mp4") {
                gif_to_mp4(format, sourceType, srcUrl);
            }
            break;
        case "video":
            
            break;
        case "audio":
            
            break;
        default:
            break;
    }
    
    
}

async function jpeg_to_png(format, sourceType, srcUrl) {
    const message = document.getElementById('message');
    const ffmpeg = await loadFFmpeg();

    const fileName = extractFileNameFromURL(srcUrl);
    const name = fileName+'.jpeg';
    await ffmpeg.writeFile(name, await fetchFile(srcUrl));
    message.innerHTML = '変換開始';
    await ffmpeg.exec(['-i', name, 'output.png']);
    message.innerHTML = fileName+'.jpeg';
    const data = await ffmpeg.readFile('output.png');

    const image = document.getElementById('output-image');
    image.src = URL.createObjectURL(new Blob([data.buffer], { type: 'image/png' }));

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([data.buffer], { type: 'image/png' }));
    link.download = fileName+'.png';
    link.click();
    if (typeof link.remove === 'function') {
        link.remove();
      } else if (typeof link.parentNode !== 'undefined' && link.parentNode !== null) {
        link.parentNode.removeChild(link);
      } else {
        console.error('Unable to remove link element.');
    }


}

async function gif_to_mp4(format, sourceType, srcUrl) {
    const message = document.getElementById('message');
    const ffmpeg = await loadFFmpeg();

    const fileName = extractFileNameFromURL(srcUrl);
    const name = fileName+'.gif';
    await ffmpeg.writeFile(name, await fetchFile(srcUrl));
    message.innerHTML = '変換開始';
    await ffmpeg.exec(['-i', name, 'output.mp4']);
    message.innerHTML = name;
    const data = await ffmpeg.readFile('output.mp4');

    const video = document.getElementById('output-video');
    video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
    link.download = fileName+'.mp4';
    link.click();
    if (typeof link.remove === 'function') {
        link.remove();
      } else if (typeof link.parentNode !== 'undefined' && link.parentNode !== null) {
        link.parentNode.removeChild(link);
      } else {
        console.error('Unable to remove link element.');
    }


}



function extractFileNameFromURL(url) {
    // URLを解析するための<a>要素を作成
    const link = document.createElement('a');
    link.href = url;

    // パスからファイル名を取得
    let fileName = link.pathname.split('/').pop();

    // ファイル名から拡張子を取り除く
    const dotIndex = fileName.lastIndexOf('.');
    if (dotIndex !== -1) {
        fileName = fileName.substring(0, dotIndex);
    }

    return fileName || null;
}
