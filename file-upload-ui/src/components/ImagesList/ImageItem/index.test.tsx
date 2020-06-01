import React from 'react';
import { render } from '@testing-library/react';
import ImageItem from './index';

describe('ImageItem', () => {
  const defaultFile = new File([], 'Dummy.png');

  const defaultImage: Image = {
    friendlyName: "Doc 1",
    size: 1,
    status: 'ready',
    file: defaultFile
  };

  test('should render friendlyName', () => {
    const image: Image = defaultImage;
    const { container } = render(<ImageItem {...image} />);
    const friendlyNameElement = container.querySelector(".ImageItem-friendlyName");

    expect(friendlyNameElement).toBeInTheDocument();
    expect(friendlyNameElement?.innerHTML).toBe(image.friendlyName);
  });

  test('should render size', () => {
    const image: Image = defaultImage;
    const { container } = render(<ImageItem {...image} />);
    const fileSizeElement = container.querySelector(".ImageItem .FileSize");

    expect(fileSizeElement).toBeInTheDocument();
    expect(fileSizeElement?.innerHTML).toBe(` ${image.size} Bytes`);
  });

  describe('when status', () => {

    describe('is adding', addingOrRemoving('adding'));
    describe('is removing', addingOrRemoving('removing'));
    describe('is failedToAdd', failedToAdd);
    describe('is failedToRemove', defaultBehaviour('failedToRemove'));
    describe('is ready', defaultBehaviour('ready'));

    let handleUploadButtonClick: jest.Mock<any, any>;
    let handleDeleteButtonClick: jest.Mock<any, any>;

    let uploadButton: Element | null = null;
    let deleteButton: Element | null = null;

    function addingOrRemoving(status: 'adding' | 'removing') {
      return function () {
        const image: Image = { ...defaultImage, status };

        beforeEach(() => initializeVariables(image));

        test('should hide Upload button', () => {
          expect(uploadButton).not.toBeInTheDocument();
        });

        test('should show Delete button', () => {
          expect(deleteButton).toBeInTheDocument();
        });

        test('should disable Delete button', () => {
          expect(deleteButton).toHaveAttribute('disabled');
          deleteButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

          expect(handleDeleteButtonClick).toBeCalledTimes(0);
        });
      }
    }

    function failedToAdd() {
      const image: Image = { ...defaultImage, status: 'failedToAdd' };

      beforeEach(() => initializeVariables(image));

      test('should show Upload button', () => {
        expect(uploadButton).toBeInTheDocument();
      });

      test('should hide Delete button', () => {
        expect(deleteButton).not.toBeInTheDocument();
      });

      test('should trigger onUploadButtonClick when Upload button is clicked', () => {
        uploadButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

        expect(handleUploadButtonClick).toBeCalledWith(
          expect.objectContaining({ name: expect.stringMatching(defaultFile.name) }),
          expect.stringMatching(image.friendlyName)
        );
        expect(handleUploadButtonClick).toBeCalledTimes(1);
      });
    }

    function defaultBehaviour(status: ImageStatus) {
      return function () {
        const image: Image = { ...defaultImage, status };

        beforeEach(() => initializeVariables(image));

        test('should hide Upload button', () => {
          expect(uploadButton).not.toBeInTheDocument();
        });

        test('should show Delete button', () => {
          expect(deleteButton).toBeInTheDocument();
        });

        test('should trigger onDeleteButtonClick when Delete button is clicked', () => {
          deleteButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

          expect(handleDeleteButtonClick).toBeCalledWith(expect.stringMatching(image.friendlyName));
          expect(handleDeleteButtonClick).toBeCalledTimes(1);
        });
      }
    }

    function initializeVariables(image: Image) {
      handleUploadButtonClick = jest.fn();
      handleDeleteButtonClick = jest.fn();

      const { container } = render(<ImageItem
        {...image}
        onUploadButtonClick={handleUploadButtonClick}
        onDeleteButtonClick={handleDeleteButtonClick}
      />);

      uploadButton = container.querySelector(".ImageItem-upload");
      deleteButton = container.querySelector(".ImageItem-delete");
    }
  });

});
