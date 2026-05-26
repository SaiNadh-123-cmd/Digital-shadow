import { hashString } from "./hashString";

export function getWebGLFingerprint() {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      return { renderer: "WebGL not supported", vendor: "N/A", hash: "N/A" };
    }

    let renderer, vendor;
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    if (ext) {
      renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
      vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
    } else {
      renderer = gl.getParameter(gl.RENDERER);
      vendor = gl.getParameter(gl.VENDOR);
    }

    const hash = hashString(renderer + vendor);
    return { renderer, vendor, hash: hash.slice(0, 12) };
  } catch {
    return { renderer: "Error reading WebGL", vendor: "N/A", hash: "N/A" };
  }
}
