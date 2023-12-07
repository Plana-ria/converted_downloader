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
            if (format=="png") {
                performConversionAndDownload('jpg', 'image', srcUrl, 'image/png', 'output-image', 'png');
            }else if(format=="jpg") {
                performConversionAndDownload('png', 'image', srcUrl, 'image/jpg', 'output-image', 'jpg');
            }
            break;
        case "gif":
            if (format=="mp4") {
                performConversionAndDownload('gif', 'video', srcUrl, 'video/mp4', 'output-video', 'mp4');
            }else if(format=="mov") {
                performConversionAndDownload('gif', 'video', srcUrl, 'video/quicktime', 'output-video', 'mov');
            }
            break;
        case "video":
            if (format=="mp4") {
                performConversionAndDownload('webm', 'video', srcUrl, 'video/mp4', 'output-video', 'mp4');
            }else if(format=="mov") {
                performConversionAndDownload('webm', 'video', srcUrl, 'video/quicktime', 'output-video', 'mov');
            }
            break;
        case "audio":
            if (format=="mp3") {
                performConversionAndDownload('wav', 'audio', srcUrl, 'audio/mp3', 'output-audio', 'mp3');
            }else if(format=="wav") {
                performConversionAndDownload('mp3', 'audio', srcUrl, 'audio/wav', 'output-audio', 'wav');
            }
            break;
        default:
            break;
    }
    
    
}

async function performConversionAndDownload(format, sourceType, srcUrl, outputType, outputElementId, outputExtension) {
    const message = document.getElementById('message');
    const ffmpeg = await loadFFmpeg();

    const fileName = extractFileNameFromURL(srcUrl);
    const inputName = fileName + '.' + sourceType;
    const outputName = 'output.' + outputExtension;

    await ffmpeg.writeFile(inputName, await fetchFile(srcUrl));

    message.innerHTML = '変換開始';
    await ffmpeg.exec(['-i', inputName, outputName]);
    message.innerHTML = fileName + '.' + sourceType;

    const data = await ffmpeg.readFile(outputName);

    const outputElement = document.getElementById(outputElementId);
    outputElement.src = URL.createObjectURL(new Blob([data.buffer], { type: outputType }));

    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([data.buffer], { type: outputType }));
    link.download = fileName + '.' + outputExtension;
    link.click();

    removeElement(link);
}

function removeElement(element) {
    if (typeof element.remove === 'function') {
        element.remove();
    } else if (element.parentNode !== null) {
        element.parentNode.removeChild(element);
    } else {
        console.error('Unable to remove element.');
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
