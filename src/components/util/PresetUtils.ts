export interface format {
  color: string;
  char?: string;
  bold?: string;
  italic?: string;
  underline?: string;
  strikethrough?: string;
}

export const presets = {
  'birdflop': [
    { hex: '#084CFB', pos: 0 },
    { hex: '#ADF3FD', pos: 100 },
  ],
  'SimplyMC': [
    { hex: '#00FFE0', pos: 0 },
    { hex: '#EB00FF', pos: 100 },
  ],
  'Rainbow': [
    { hex: '#FF0000', pos: 0 },
    { hex: '#FF7F00', pos: 16.66 },
    { hex: '#FFFF00', pos: 33.33 },
    { hex: '#00FF00', pos: 50 },
    { hex: '#0000FF', pos: 66.66 },
    { hex: '#4B0082', pos: 83.33 },
    { hex: '#9400D3', pos: 100 },
  ],
  'Skyline': [
    { hex: '#1488CC', pos: 0 },
    { hex: '#2B32B2', pos: 100 },
  ],
  'Mango': [
    { hex: '#FFE259', pos: 0 },
    { hex: '#FFA751', pos: 100 },
  ],
  'Vice City': [
    { hex: '#3494E6', pos: 0 },
    { hex: '#EC6EAD', pos: 100 },
  ],
  'Dawn': [
    { hex: '#F3904F', pos: 0 },
    { hex: '#3B4371', pos: 100 },
  ],
  'Rose': [
    { hex: '#F4C4F3', pos: 0 },
    { hex: '#FC67FA', pos: 100 },
  ],
  'Firewatch': [
    { hex: '#CB2D3E', pos: 0 },
    { hex: '#EF473A', pos: 100 },
  ],
};

export const v3formats = [
  {
    color: '&#$1$2$3$4$5$6$f$c',
    char: '&',
  },
  {
    color: 'MiniMessage',
    bold: '<b>$t</b>',
    italic: '<i>$t</i>',
    underline: '<u>$t</u>',
    strikethrough: '<s>$t</s>',
  },
  {
    color: '§x§$1§$2§$3§$4§$5§$6$f$c',
    char: '§',
  },
  {
    color: '&x&$1&$2&$3&$4&$5&$6$f$c',
    char: '&',
  },
  {
    color: '<#$1$2$3$4$5$6>$f$c',
    char: '&',
  },
  {
    color: '[COLOR=#$1$2$3$4$5$6]$c[/COLOR]',
    bold: '[BOLD]$t[/BOLD]',
    italic: '[ITALIC]$t[/ITALIC]',
    underline: '[UNDERLINE]$t[/UNDERLINE]',
    strikethrough: '[STRIKETHROUGH]$t[/STRIKETHROUGH]',
  },
];

export const types = [
  { name: 'Normal (Left -> Right)', value: 1 },
  { name: 'Reversed (Right -> Left)', value: 2 },
  { name: 'Bouncing (Left -> Right -> Left)', value: 3 },
  { name: 'Full Text Cycle', value: 4 },
];

export const defaults = {
  version: 4,
  colors: presets.birdflop,
  colorlength: 1,
  name: 'logo',
  text: 'birdflop',
  type: 1,
  speed: 50,
  length: 1,
  format: v3formats[0] as format,
  prefixsuffix: '',
  customFormat: false,
  outputFormat: '%name%:\n  change-interval: %speed%\n  texts:\n%output:{  - "$t"}%',
  trimspaces: true,
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
};

function decompress(input: number, expectedValues: number) {
  const values = [];
  for (let i = 0; i < expectedValues; i++) {
    const value = !!((input >> i) & 1);
    values.push(value);
  }
  return values;
}

const v1formats = {
  0: {
    outputPrefix: '',
    template: '&#$1$2$3$4$5$6$f$c',
    formatChar: '&',
    maxLength: 256,
  },
  1: {
    outputPrefix: '',
    template: '<#$1$2$3$4$5$6>$f$c',
    formatChar: '&',
    maxLength: 256,
  },
  2: {
    outputPrefix: '',
    template: '&x&$1&$2&$3&$4&$5&$6$f$c',
    formatChar: '&',
    maxLength: 256,
  },
  3: {
    outputPrefix: '/nick ',
    template: '&#$1$2$3$4$5$6$f$c',
    formatChar: '&',
    maxLength: 256,
  },
  4: {
    outputPrefix: '/nick ',
    template: '<#$1$2$3$4$5$6>$f$c',
    formatChar: '&',
    maxLength: 256,
  },
  5: {
    outputPrefix: '/nick ',
    template: '&x&$1&$2&$3&$4&$5&$6$f$c',
    formatChar: '&',
    maxLength: 256,
  },
  6: {
    outputPrefix: '',
    template: '§x§$1§$2§$3§$4§$5§$6$f$c',
    formatChar: '§',
  },
  7: {
    outputPrefix: '',
    template: '[COLOR=#$1$2$3$4$5$6]$c[/COLOR]',
    formatChar: '',
  },
  8: {
    outputPrefix: '',
    template: '',
    custom: true,
    formatChar: '',
  },
};

export function fromBinary(encoded: string) {
  let binary;
  try {
    binary = atob(encoded);
  } catch (error) {
    return '';
  }
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint16Array(bytes.buffer));
}

export function loadPreset(p: string): Partial<typeof defaults> {
  let version: number;
  let preset: any;
  let newPreset = { ...defaults };
  if (fromBinary(p) !== '') {
    preset = JSON.parse(fromBinary(p));
    version = preset.version;
  } else {
    preset = JSON.parse(p);
    version = preset.version;
  }
  if (version === defaults.version) {
    return preset;
  }
  if (version === 1) {
    newPreset.version = defaults.version;
    newPreset.colors = preset.colors.map((color: string, i: number) => ({ hex: color, pos: (100 / (preset.colors.length - 1)) * i }));
    newPreset.name = preset.name;
    newPreset.text = preset.text;
    newPreset.speed = preset.speed;
    newPreset.type = Number(preset.type) + 1;
    newPreset.format = v3formats.find((f) => f.color === v1formats[preset['output-format'] as keyof typeof v1formats].template) || {
      color: v1formats[preset['output-format'] as keyof typeof v1formats].template,
      char: v1formats[preset['output-format'] as keyof typeof v1formats].formatChar,
    };
    newPreset.customFormat = preset['custom-format'] !== '';
    newPreset.prefixsuffix = v1formats[preset['output-format'] as keyof typeof v1formats].outputPrefix ? `${v1formats[preset['output-format'] as keyof typeof v1formats].outputPrefix}$t` : '';
    const formatting = decompress(preset.formats, 4);
    newPreset.bold = formatting[0];
    newPreset.italic = formatting[1];
    newPreset.underline = formatting[2];
    newPreset.strikethrough = formatting[3];
  }
  if (version === 2) {
    newPreset.version = defaults.version;
    newPreset.colors = preset.colors.map((color: string, i: number) => ({ hex: color, pos: (100 / (preset.colors.length - 1)) * i }));
    newPreset.name = preset.name;
    newPreset.text = preset.text;
    newPreset.speed = preset.speed;
    newPreset.type = preset.type;
    newPreset.format = v3formats.find((f) => f.color === preset.format) || {
      color: preset.format,
      char: preset.formatchar,
    };
    newPreset.customFormat = preset.customFormat;
    newPreset.prefixsuffix = preset.prefix ? `${preset.prefix}$t` : '';
    newPreset.bold = preset.bold;
    newPreset.italic = preset.italic;
    newPreset.underline = preset.underline;
    newPreset.strikethrough = preset.strikethrough;
  }
  if (version === 3) {
    newPreset = {
      ...newPreset,
      colors: preset.colors ? preset.colors.map((color: string, i: number) => ({ hex: color, pos: (100 / (preset.colors.length - 1)) * i })) : newPreset.colors,
    };
  }

  (Object.keys(newPreset) as Array<keyof typeof newPreset>).forEach((key) => {
    if (newPreset[key] === defaults[key] && key !== 'version') {
      delete newPreset[key];
    }
  });

  return newPreset as Partial<typeof defaults>;
}