/* eslint-env browser */

import compile from './helpers/compiler';
import runTestInJsdom from './helpers/runTestInJsdom';

describe('loader', () => {
  const injectTypes = ['styleTag', 'useableStyleTag', 'linkTag'];

  injectTypes.forEach((injectType) => {
    expect.assertions(3);

    it(`should work ("injectType" option is "${injectType}")`, async () => {
      const testId =
        injectType === 'useableStyleTag' ? './useable.js' : './simple.js';
      const stats = await compile(testId, { loader: { injectType } });

      runTestInJsdom(stats, (dom) => {
        expect(dom.serialize()).toMatchSnapshot('DOM');
      });

      expect(stats.compilation.warnings).toMatchSnapshot('warnings');
      expect(stats.compilation.errors).toMatchSnapshot('errors');
    });

    it(`should work with css modules ("injectType" option is "${injectType}")`, async () => {
      expect.assertions(3);

      const testId =
        injectType === 'useableStyleTag'
          ? './useable-css-modules.js'
          : './css-modules.js';
      const stats = await compile(testId, {
        loader: { injectType },
        cssLoader: {
          options: {
            modules: { localIdentName: '[name]-[local]_[hash:base64:7]' },
          },
        },
      });

      runTestInJsdom(stats, (dom) => {
        expect(dom.serialize()).toMatchSnapshot('DOM');
      });

      expect(stats.compilation.warnings).toMatchSnapshot('warnings');
      expect(stats.compilation.errors).toMatchSnapshot('errors');
    });
  });

  it('should work for useable inject type and negative ref', async () => {
    expect.assertions(3);

    const testId = './useable-negative-refs.js';
    const stats = await compile(testId, {
      loader: { injectType: 'useableStyleTag' },
    });

    runTestInJsdom(stats, (dom) => {
      expect(dom.serialize()).toMatchSnapshot('DOM');
    });

    expect(stats.compilation.warnings).toMatchSnapshot('warnings');
    expect(stats.compilation.errors).toMatchSnapshot('errors');
  });
});
