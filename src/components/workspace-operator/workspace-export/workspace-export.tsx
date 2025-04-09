import { Button } from "@/components/ui/button";

export default function WorkspaceExport() {

  const exportNetworkAsImage = (type: string) => {
    // We only have one canvas, so can query directly
    const canvas = document.querySelector('canvas');

    if (canvas) {
      // Convert the canvas to a data URL (Base64 image)
      const dataURL = canvas.toDataURL(type);

      // Create a download link
      const link = document.createElement('a');
      link.href = dataURL;
      if (type === 'image/png') {
        link.download = 'network.png';
      } else if (type === 'image/jpeg') {
        link.download = 'network.jpeg';
      }

      // Programmatically click the link to trigger the download
      link.click();
    } else {
      console.error('Canvas not found!');
    }
  }

  return (
    <div className="flex 2xl:flex-row xl:flex-col gap-4 m-1">
      <Button onClick={() => exportNetworkAsImage('image/png')}>Export as PNG</Button>
      <Button onClick={() => exportNetworkAsImage('image/jpeg')}>Export as JPEG</Button>
    </div>
  )
}