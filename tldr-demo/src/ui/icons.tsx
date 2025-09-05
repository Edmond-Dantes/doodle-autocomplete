//icon registry

// src/ui/icons.ts
import type { TLUiAssetUrlOverrides } from 'tldraw'

export const assetUrls: TLUiAssetUrlOverrides = {
  icons: {
    // app branding (for later)
    'kevin-logo': './icons/kevin.svg',

    // tools
    'stamp-icon': './icons/stamp.svg',
    'axis-icon': './icons/axis.svg',
    'bat-icon': './icons/bat.svg',
    'boat-icon': './icons/boat.svg',
    'car-icon': './icons/car.svg',
    'cat-icon': './icons/cat.svg',
    'dog-icon': './icons/dog.svg',
    'glasses-icon': './icons/glasses.svg',
    'house-icon': './icons/house.svg',
    'moon-icon': './icons/moon.svg',
    'sailboat-icon': './icons/sailboat.svg',
    'stick-icon': './icons/stick.svg',
    'tree-icon': './icons/tree.svg',
    // add future icons here: 'foo-icon': '/icons/foo.svg',

    // used by your colour button to hide the glyph
    'blank-icon':
      'data:image/svg+xml;utf8,' +
      encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'),
  },
}
