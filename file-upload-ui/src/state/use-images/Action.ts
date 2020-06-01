export type Action =
  | { type: 'beginFetchingImages' }
  | { type: 'finishFetchingImages', data: Image[] }

  | { type: 'beginAddingImage', image: Image }
  | { type: 'finishAddingImage', friendlyName: string, successful: boolean }

  | { type: 'beginRemovingImage', friendlyName: string }
  | { type: 'finishRemovingImage', friendlyName: string, successful: boolean }
  ;
