// background.js




chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
      title: "変換して保存",
      contexts: ["image"],
      id: "converted_download",
    });
    
    chrome.contextMenus.create({
        title: "PNGに変換",
        parentId: "converted_download",
        id: "convert_image_to_png",
        contexts: ["image"],
    });
    chrome.contextMenus.create({
        title: "JPGに変換",
        parentId: "converted_download",
        id: "convert_image_to_jpg",
        contexts: ["image"],
    });
    chrome.contextMenus.create({
      title: "MP4に変換(gif)",
      parentId: "converted_download",
      id: "convert_gif_to_mp4",
      contexts: ["image"],
    });
    chrome.contextMenus.create({
      title: "MOVに変換(gif)",
      parentId: "converted_download",
      id: "convert_gif_to_mov",
      contexts: ["image"],
    });

    chrome.contextMenus.create({
        title: "MP4に変換",
        parentId: "converted_download",
        id: "convert_video_to_mp4",
        contexts: ["video"],
    });
    chrome.contextMenus.create({
    title: "MOVに変換",
    parentId: "converted_download",
    id: "convert_video_to_mov",
    contexts: ["video"],
    });

    chrome.contextMenus.create({
        title: "MP3に変換",
        parentId: "converted_download",
        id: "convert_audio_to_mp3",
        contexts: ["audio"],
    });
    chrome.contextMenus.create({
        title: "WAVに変換",
        parentId: "converted_download",
        id: "convert_audio_to_wav",
        contexts: ["audio"],
    });

  });
  
  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "convert_image_to_png") {
        sendMessage("convertAndSave", { format: "png", type: "image", url: info.srcUrl });
    } else if (info.menuItemId === "convert_image_to_jpg") {
        sendMessage("convertAndSave", { format: "jpg", type: "image", url: info.srcUrl });
    } else if (info.menuItemId === "convert_gif_to_mp4") {
        sendMessage("convertAndSave", { format: "mp4", type: "gif", url: info.srcUrl });
    } else if (info.menuItemId === "convert_gif_to_mov") {
        sendMessage("convertAndSave", { format: "mov", type: "gif", url: info.srcUrl });
    }
});

function sendMessage(action, data) {
    chrome.runtime.sendMessage({ action, data });
}
