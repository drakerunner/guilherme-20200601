import React from 'react';
import { render, RenderResult, fireEvent } from '@testing-library/react';
import App, { GetImagesEndpoint, SearchImagesEndpoint, PostOrDeleteImageEndpoint } from './App';
import { act } from 'react-dom/test-utils';

describe('App', () => {
  let result: RenderResult;

  const images = [
    createImage('Doc 1', 1),
    createImage('Doc 2', Math.pow(1024, 1)),
    createImage('Doc 3', Math.pow(1024, 2)),
    createImage('Doc 4', Math.pow(1024, 3)),
    createImage('Doc 5', Math.pow(1024, 4)),
    createImage('Doc 6', Math.pow(1024, 5)),
    createImage('Doc 7', Math.pow(1024, 6))
  ];

  it('should show spinner when loading images', async () => {
    jest.spyOn(global, "fetch").mockImplementation((input) => new Promise<Response>((resolve, reject) => { }));

    await act(async () => {
      result = render(<App />);
    });
    const { container } = result;
    const loadingElement = container.querySelector(".Spinner");

    expect(loadingElement).toBeInTheDocument();
  });

  describe('when application loaded', () => {
    it('should load images on load', async () => {
      await act(async () => {
        result = render(<App />);
      });

      validateNumberOfDocs(7);
    });

    it('should handle errors on loading images', async () => {
      jest.spyOn(global, "fetch").mockImplementation((input) => new Promise<Response>((resolve, reject) => { reject() }));

      await act(async () => {
        result = render(<App />);
      });

      validateNumberOfDocs(0);
    });

    it('should search images', async () => {
      await act(async () => {
        result = render(<App />);
      });

      await searchImages('Doc 1');
      validateNumberOfDocs(1);
    });

    describe('when handling errors from search images', () => {
      it('should handle promise rejection', async () => {
        await act(async () => {
          result = render(<App />);
        });

        await searchImages('Doc 2');
        validateNumberOfDocs(0);
      });

      it('should handle wrong return type', async () => {
        await act(async () => {
          result = render(<App />);
        });

        await searchImages('Doc 3');
        validateNumberOfDocs(0);
      });
    });

    it('should upoad image', async () => {
      await act(async () => {
        result = render(<App />);
      });

      await uploadFile(new File([], 'Doc 8'));
      validateNumberOfDocs(8);
    });

    it('should abort upload if file is not selected', async () => {
      await act(async () => {
        result = render(<App />);
      });

      await uploadFile(null);
      validateNumberOfDocs(7);
    });

    it('should handle errors when uploading image', async () => {
      await act(async () => {
        result = render(<App />);
      });

      await uploadFile(new File([], ''));
      validateNumberOfDocs(8);
    });

    it('should remove image', async () => {
      await act(async () => {
        result = render(<App />);
      });

      await removeFirstImage();
      validateNumberOfDocs(6);
    });

    it('should handle errors when removing image', async () => {
      await act(async () => {
        result = render(<App />);
      });

      await removeImageWithError();
      validateNumberOfDocs(7);
    });

    beforeEach(() => {
      jest.spyOn(global, "fetch").mockImplementation(async (input, init) => {
        if (typeof (input) === 'string') {

          if (input === GetImagesEndpoint) {
            return { json: async () => images }
          }

          if (input.startsWith(SearchImagesEndpoint)) {
            var pattern = decodeURIComponent(input.replace(SearchImagesEndpoint, ''));
            if (pattern === 'Doc 2') {
              throw new Error();
            }

            if (pattern === 'Doc 3') {
              return { json: async () => ({}) }
            }

            return { json: async () => images.filter(i => i.friendlyName.indexOf(pattern) >= 0) }
          }

          if (input.startsWith(PostOrDeleteImageEndpoint)) {
            var friendlyName = decodeURIComponent(input.replace(PostOrDeleteImageEndpoint, ''));
            if (!friendlyName || friendlyName === 'Doc 2') {
              throw new Error();
            }

            return { ok: true }
          }
        }

        return {} as any;
      });
    });
  });

  async function searchImages(pattern: string) {
    const { container } = result;
    const inputElement = container.querySelector('.SearchBar-input');

    await act(async () => {
      inputElement && fireEvent.blur(inputElement, { target: { value: pattern } });
    });
  }

  async function uploadFile(file: File | null) {
    const { container } = result;
    const uploadInput = container.querySelector(".Upload-input");

    await act(async () => {
      uploadInput && fireEvent.change(uploadInput, { target: { files: [file] } });
    });
  }

  async function removeFirstImage() {
    const { container } = result;
    const firstButton = container.querySelector(".ImageItem-delete");

    await act(async () => {
      firstButton && fireEvent.click(firstButton);
    });
  }

  async function removeImageWithError() {
    const { container } = result;
    const secondImage = container.querySelectorAll(".ImageItem-delete")[1];

    await act(async () => {
      secondImage && fireEvent.click(secondImage);
    });
  }

  function validateNumberOfDocs(expectedNumberOfDocs: number) {
    const { container } = result;

    const documentsCountElement = container.querySelector(".ImageList-documents");
    expect(documentsCountElement).toBeInTheDocument();
    expect(documentsCountElement?.innerHTML).toBe(`${expectedNumberOfDocs} documents`);
  }

  function createImage(friendlyName: string, size: number): Image {
    return {
      friendlyName,
      size,
      status: 'ready'
    };
  }
});
