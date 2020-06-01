import React from 'react';

const k = 1024;
const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

function formatBytes(bytes: number) {
  let size = 0;
  let suffix = sizes[0];

  if (bytes > 0) {
    const dm = 2;
    let i = Math.floor(Math.log(bytes) / Math.log(k));

    if (i >= sizes.length) {
      i = sizes.length - 1;
    }

    size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    suffix = sizes[i];
  }

  return { size, suffix };
}

export default React.memo(function ({ bytes }: { bytes: number }) {
  const { size, suffix } = formatBytes(bytes);

  return (<span className="FileSize"> {size} {suffix}</span>);
})
