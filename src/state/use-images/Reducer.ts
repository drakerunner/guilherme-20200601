import { State } from "./State";
import { Action } from "./Action";
import { ApiStatus } from "./ApiStatus";

export default class {
  reducer() {
    const self = this;

    return function (state: State, action: Action): State {
      switch (action.type) {

        case 'beginFetchingImages': return self.beginFetchingImages(state);
        case 'finishFetchingImages': return self.finishFetchingImages(state, action.data);

        case 'beginAddingImage': return self.beginAddingImage(state, action.image);
        case 'finishAddingImage': return self.finishAddingImage(state, action.friendlyName, action.successful);

        case 'beginRemovingImage': return self.beginRemovingImage(state, action.friendlyName);
        case 'finishRemovingImage': return self.finishRemovingImage(state, action.friendlyName, action.successful);

        default: return state;
      }
    }
  }

  private beginFetchingImages(state: State): State {
    return {
      ...state,
      apiStatus: ApiStatus.FetchingImages
    };
  }

  private finishFetchingImages(state: State, images: any): State {
    if (!Array.isArray(images)) {
      images = [];
    }

    return {
      ...state,
      apiStatus: ApiStatus.Ready,
      images
    };
  }

  private beginAddingImage(state: State, image: Image): State {
    return {
      ...state,
      apiStatus: ApiStatus.Ready,
      images: [...state.images.filter(i => i.friendlyName !== image.friendlyName), image]
    };
  }

  private finishAddingImage(state: State, friendlyName: string, successful: boolean): State {
    const images = state.images.map(i => {
      if (i.friendlyName === friendlyName) {
        i.status = successful ? 'ready' : 'failedToAdd';
      }

      return i;
    });

    return {
      ...state,
      apiStatus: ApiStatus.Ready,
      images
    };
  }

  private beginRemovingImage(state: State, friendlyName: string): State {
    const images = state.images.map(i => {
      if (i.friendlyName === friendlyName) {
        i.status = 'removing';
      }

      return i;
    });

    return { ...state, images };
  }

  private finishRemovingImage(state: State, friendlyName: string, successful: boolean): State {
    const images = (successful)
      ? state.images.filter(i => i.friendlyName !== friendlyName)
      : state.images.map(i => {
        if (i.friendlyName === friendlyName) {
          i.status = 'failedToRemove';
        }

        return i;
      })

    return { ...state, images };
  }
}
