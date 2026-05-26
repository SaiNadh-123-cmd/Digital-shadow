import { hashString } from "./hashString";

export function getCanvasFingerprint() {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 150;
    const ctx = canvas.getContext("2d");

    // a — orange rect
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);

    // b — dark blue text
    ctx.fillStyle = "#069";
    ctx.font = "11pt Arial";
    ctx.fillText("Cwm fjordbank glyphs vext quiz, 😃", 2, 15);

    // c — green semi-transparent text
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.font = "18pt Times New Roman";
    ctx.fillText("Cwm fjordbank glyphs vext quiz", 4, 45);

    // d — cyan circle
    ctx.beginPath();
    ctx.arc(50, 100, 40, 0, Math.PI * 2);
    ctx.fillStyle = "#0ff";
    ctx.fill();

    // e — red-ish triangle
    ctx.beginPath();
    ctx.moveTo(100, 60);
    ctx.lineTo(160, 120);
    ctx.lineTo(40, 120);
    ctx.fillStyle = "rgba(255,0,128,0.7)";
    ctx.fill();

    const dataURL = canvas.toDataURL();
    const hash = hashString(dataURL);
    return hash.slice(0, 16);
  } catch {
    return "canvas-blocked";
  }
}
