export const getFilePreviewInfo = (url) => {
  const extension = url.split(".").pop()?.toLowerCase();

  let icon = "";

  switch (extension) {
    case "pdf":
      icon = "/icons/pdf.png";
      break;
    case "doc":
    case "docx":
      icon = "/icons/docx.png";
      break;
    case "ppt":
    case "pptx":
      icon = "/icons/slide.png";
      break;
    case "xls":
    case "xlsx":
      icon = "/icons/xls.png";
      break;
    case "txt":
      type = "text";
      icon = "/icons/txt.png";
      break;
    case "zip":
    case "rar":
    case "7z":
      icon = "/icons/zip.png";
      break;
    case "mp3":
    case "wav":
    case "m4a":
    case "aac":
    case "webm":
    case "ogg":
      icon = "/icons/audio.png";
      break;
    case "webp":
    case "jpg":
    case "jpeg":
    case "png":
    case "heic":
    case "heif":
    case "tiff":
    case "ico":
      icon = "/icons/photo.png"
      break
    default:
      icon = "/icons/file.png";
  }

  return icon;
};


export const isAudioFile = (fileName) => {
  const audioExtensions = [".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac", ".webm"];
  const ext = "." + fileName.split(".").pop()?.toLowerCase()
  return audioExtensions.includes(ext);
};