import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Upload from './index';

describe('Upload', () => {
  it('should trigger onFileSelected when file input changed', () => {
    const handleFileSelected = jest.fn();

    const { container } = render(<Upload onFileSelected={handleFileSelected} />);
    const uploadButton = container.querySelector(".Upload-button");
    const uploadInput = container.querySelector(".Upload-input");

    uploadButton && fireEvent.click(uploadButton);
    uploadInput && fireEvent.change(uploadInput, { target: { files: [new File([], '')] } });

    expect(handleFileSelected).toBeCalledTimes(1);
  });
});
