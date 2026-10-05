import { toast } from "sonner";

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

export async function handleResumeDownload(resumeUrl?: string | null) {
  const toastId = "resume-download-toast";
  toast.loading("Downloading resume...", {
    id: toastId,
    description: "Preparing your file, please wait...",
  });

  const targetFilename = "Md_Mahfujur_Rahman_Resume.pdf";
  const dbResume = resumeUrl?.trim();

  if (dbResume) {
    try {
      await downloadAndOpen(dbResume, targetFilename);
      toast.success("Download completed", {
        id: toastId,
        description: "Resume downloaded successfully.",
        duration: 4000,
      });
      return;
    } catch (err) {
      console.warn("Database resume download failed, falling back to /resume.pdf", err);
    }
  }

  try {
    await downloadAndOpen("/resume.pdf", targetFilename);
    toast.success("Download completed", {
      id: toastId,
      description: "Resume downloaded successfully.",
      duration: 4000,
    });
  } catch (err) {
    console.error("Resume download failed:", err);
    toast.error("Download failed", {
      id: toastId,
      description: "Could not download resume. Please try again later.",
      duration: 5000,
    });
  }
}

export default downloadFileFromUrl;
