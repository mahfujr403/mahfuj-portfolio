export async function downloadFileFromUrl(url: string, filename?: string) {
  const resp = await fetch(url, { mode: "cors" });
  if (!resp.ok) throw new Error("Failed to fetch file");
  const blob = await resp.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename || url.split("/").pop() || "download";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // revoke after short delay to ensure browser had time to use the object URL
  setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
}

export async function downloadAndOpen(url: string, filename?: string) {
  const resp = await fetch(url, { mode: "cors" });
  if (!resp.ok) throw new Error("Failed to fetch file");
  const blob = await resp.blob();
  const objectUrl = URL.createObjectURL(blob);

  // trigger download
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename || url.split("/").pop() || "download";
  document.body.appendChild(a);
  a.click();
  a.remove();

  // open in new tab/window
  try {
    window.open(objectUrl, "_blank");
  } catch (e) {
    // ignored
  }

  // revoke after short delay
  setTimeout(() => URL.revokeObjectURL(objectUrl), 3000);
}

export default downloadFileFromUrl;
