import React from "react";
import './style.css';

export default function ({ onFileSelected }: { onFileSelected?: (selectedFile: File | null | undefined, friendlyName: string) => void }) {

  const fileRef = React.createRef<HTMLInputElement>();

  function handleButtonClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    fileRef.current?.click();
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;
    const file = files && files[0];
    const friendlyName = file?.name || "";

    e.target.value = "";

    onFileSelected && onFileSelected(file, friendlyName);
  }

  return (<div className='Upload'>
    <input
      className="Upload-input"
      ref={fileRef}
      type="file"
      onChange={handleFileInputChange}
    />
    <button className="Upload-button" onClick={handleButtonClick}>Upload</button>
  </div>);
}
