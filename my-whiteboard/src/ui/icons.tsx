//icon registry

// src/ui/icons.ts
import type { TLUiAssetUrlOverrides } from 'tldraw'

export const assetUrls: TLUiAssetUrlOverrides = {
  icons: {
    // app branding (for later)
    'kevin-logo': '/icons/kevin.svg',

    // tools
    'stamp-icon': '/icons/stamp.svg',
    // add future icons here: 'foo-icon': '/icons/foo.svg',

    // used by your colour button to hide the glyph
    'blank-icon':
      'data:image/svg+xml;utf8,' +
      encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'),
  },
}
