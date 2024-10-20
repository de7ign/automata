import { Button } from "@/components/ui/button";

export default function WorkspaceExport() {

  const exportNetworkAsImage = () => {
    // We only have one canvas, so can query directly
    const canvas = document.querySelector('canvas');

    if (canvas) {
      // Convert the canvas to a data URL (Base64 image)
      const dataURL = canvas.toDataURL();

      // Create a download link
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'network.png';

      // Programmatically click the link to trigger the download
      link.click();
    } else {
      console.error('Canvas not found!');
    }
  }

  return (
    <div className="m-1">
      <Button onClick={exportNetworkAsImage}>Export as PNG</Button>
    </div>
  )
}