import React from 'react';
import { render } from '@testing-library/react';
import FileSize from './index';

const KB = Math.pow(1024, 1);
const MB = Math.pow(1024, 2);
const GB = Math.pow(1024, 3);
const TB = Math.pow(1024, 4);
const PB = Math.pow(1024, 5);
const EB = Math.pow(1024, 6);
const ZB = Math.pow(1024, 7);
const YB = Math.pow(1024, 8);

describe('FileSize', () => {
  describe('when bytes', () => {

    describe(`under 1`, () => {
      shouldRenderBytesAs(0, ' 0 Bytes');
      shouldRenderBytesAs(-1, ` 0 Bytes`);
    });

    describe(`between 1 and ${KB}`, () => {
      shouldRenderBytesAs(1, ' 1 Bytes');
      shouldRenderBytesAs((KB - 1), ` 1023 Bytes`);
    });

    describe(`between ${KB} and ${MB}`, () => {
      shouldRenderBytesAs((KB), ' 1 KB');
      shouldRenderBytesAs((MB - 1), ' 1024 KB');
    });

    describe(`between ${MB} and ${GB}`, () => {
      shouldRenderBytesAs((MB), ' 1 MB');
      shouldRenderBytesAs((GB - 1), ' 1024 MB');
    });

    describe(`between ${GB} and ${TB}`, () => {
      shouldRenderBytesAs((GB), ' 1 GB');
      shouldRenderBytesAs((TB - 1), ' 1024 GB');
    });

    describe(`between ${TB} and ${PB}`, () => {
      shouldRenderBytesAs((TB), ' 1 TB');
      shouldRenderBytesAs((PB), ' 1 PB');
    });

    describe(`over ${EB}`, () => {
      shouldRenderBytesAs((EB), ` ${Math.pow(1024, 1)} PB`);
      shouldRenderBytesAs((ZB), ` ${Math.pow(1024, 2)} PB`);
      shouldRenderBytesAs((YB), ` ${Math.pow(1024, 3)} PB`);
    });

    function shouldRenderBytesAs(bytes: number, exptedValue: string) {
      test(`should render ${bytes} as '${exptedValue}'`, function () {
        const { container } = render(<FileSize bytes={bytes} />);
        const element = container.querySelector(".FileSize");
        expect(element?.innerHTML).toBe(exptedValue);

      })
    }
  });
});
