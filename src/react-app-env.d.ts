/// <reference types="react-scripts" />

interface Image {
  friendlyName: string;
  size: number;
  file?: File;
  status: ImageStatus;
};

type ImageStatus = 'adding' | 'removing' | 'failedToAdd' | 'failedToRemove' | 'ready';
