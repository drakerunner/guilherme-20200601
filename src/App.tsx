import React, { useEffect } from 'react';
import './App.css';

import SearchBar from './components/SearchBar';
import Upload from './components/Upload';
import Spinner from './components/Spinner';
import ImagesList from './components/ImagesList';

import useImages, { ApiStatus } from './state/use-images';

export const GetImagesEndpoint = 'api/images';
export const SearchImagesEndpoint = 'api/images/search?pattern=';
export const PostOrDeleteImageEndpoint = 'api/images/';

export default function () {

  const [{ apiStatus, images }, dispatch] = useImages();
  const main = apiStatus === ApiStatus.Ready
    ? <ImagesList images={images} onDeleteButtonClick={handleDeleteButtonClick} onUploadButtonClick={handleFileSelected} />
    : <Spinner />
    ;

  useEffect(() => {
    if (apiStatus === ApiStatus.Unitialized) {
      dispatch({ type: 'beginFetchingImages' });

      fetch(GetImagesEndpoint)
        .then(res => res.json())
        .then(
          result => dispatch({ type: 'finishFetchingImages', data: result }),
          error => dispatch({ type: 'finishFetchingImages', data: [] }))
    }
  });

  function handleSearchPatternChange(pattern: string) {
    dispatch({ type: 'beginFetchingImages' });

    fetch(SearchImagesEndpoint + encodeURIComponent(pattern))
      .then(res => res.json(), error => dispatch({ type: 'finishFetchingImages', data: [] }))
      .then(result => dispatch({ type: 'finishFetchingImages', data: result }))
      ;
  }

  function handleFileSelected(file: File | undefined | null, friendlyName: string) {
    if (file) {
      dispatch({
        type: 'beginAddingImage', image: {
          friendlyName,
          size: file.size,
          file,
          status: 'adding'
        }
      })

      const body = new FormData();
      body.append('file', file);

      fetch(PostOrDeleteImageEndpoint + encodeURIComponent(friendlyName), { method: 'POST', body })
        .then(
          res => dispatch({ type: 'finishAddingImage', friendlyName, successful: res.ok }),
          error => dispatch({ type: 'finishAddingImage', friendlyName, successful: false }))
        ;
    }
  }

  function handleDeleteButtonClick(friendlyName: string) {
    dispatch({ type: 'beginRemovingImage', friendlyName });

    fetch(PostOrDeleteImageEndpoint + encodeURIComponent(friendlyName), { method: 'DELETE' })
      .then(
        res => dispatch({ type: 'finishRemovingImage', friendlyName, successful: res.ok }),
        error => dispatch({ type: 'finishRemovingImage', friendlyName, successful: false }))
      ;
  }

  return (
    <div className="App">
      <div>
        <header>
          <SearchBar onSearchPatternChange={handleSearchPatternChange} />
          <Upload onFileSelected={handleFileSelected} />
        </header>
        <main>
          {main}
        </main>
      </div>
    </div>
  );
}
