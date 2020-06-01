import React from 'react';
import { render } from '@testing-library/react';
import ImageList from './index';

describe('ImageList', () => {
  const images = [
    createImage('Doc 1', 1),
    createImage('Doc 2', Math.pow(1024, 1)),
    createImage('Doc 3', Math.pow(1024, 2)),
    createImage('Doc 4', Math.pow(1024, 3)),
    createImage('Doc 5', Math.pow(1024, 4)),
    createImage('Doc 6', Math.pow(1024, 5)),
    createImage('Doc 7', Math.pow(1024, 6))
  ];

  test('should render number of documents', () => {
    const { container } = render(<ImageList images={images} />);
    const documentsCountElement = container.querySelector(".ImageList-documents");

    expect(documentsCountElement).toBeInTheDocument();
    expect(documentsCountElement?.innerHTML).toBe(`${images.length} documents`);
  });

  test('should render total files size', () => {
    const { container } = render(<ImageList images={images} />);
    const totalSizeElement = container.querySelector(".ImageList-totalSize .FileSize");

    expect(totalSizeElement).toBeInTheDocument();
    expect(totalSizeElement?.innerHTML).toBe(` 1025 PB`);
  });

  test(`should forward ImageItem's delete button click event`, () => {
    const handleDeleteButtonClick = jest.fn();
    const { container } = render(<ImageList images={images} onDeleteButtonClick={handleDeleteButtonClick} />);
    const deleteButtons = container.querySelectorAll(".ImageItem-delete");

    deleteButtons.forEach(b => b.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(handleDeleteButtonClick).toBeCalledTimes(images.length);
  });

  test(`should forward ImageItem's upload button click event`, () => {
    const handleUploadButtonClick = jest.fn();
    const failedImages = images.map(i => ({ ...i, status: 'failedToAdd' }) as Image);
    const { container } = render(<ImageList images={failedImages} onUploadButtonClick={handleUploadButtonClick} />);
    const uploadButtons = container.querySelectorAll(".ImageItem-upload");

    uploadButtons.forEach(b => b.dispatchEvent(new MouseEvent("click", { bubbles: true })));
    expect(handleUploadButtonClick).toBeCalledTimes(images.length);
  });

  function createImage(friendlyName: string, size: number): Image {
    return {
      friendlyName,
      size,
      status: 'ready'
    };
  }
});
