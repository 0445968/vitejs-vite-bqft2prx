import type { ElementType } from 'react';

export type ContentType =
  | 'link'
  | 'text'
  | 'email'
  | 'call'
  | 'sms'
  | 'vcard'
  | 'whatsapp'
  | 'wifi'
  | 'pdf'
  | 'app'
  | 'image'
  | 'video'
  | 'social'
  | 'event'
  | 'barcode';

export type DotShape =
  | 'square'
  | 'rounded'
  | 'circle'
  | 'diamond'
  | 'star'
  | 'cross'
  | 'heart'
  | 'leaf';

export type EyeOuter =
  | 'sq'
  | 'rnd'
  | 'cir'
  | 'dbl'
  | 'brk'
  | 'dia'
  | 'dts'
  | 'shld';

export type EyeInner =
  | 'sq'
  | 'rnd'
  | 'cir'
  | 'dia'
  | 'str'
  | 'crs'
  | 'rng'
  | 'hrt';

export type FrameStyle =
  | 'none'
  | 'thin'
  | 'round'
  | 'dbl'
  | 'scan'
  | 'lblb'
  | 'lblt'
  | 'pol'
  | 'badge'
  | 'cert';

export type GradientDirection = 'diag' | 'h' | 'v' | 'rad';
export type BackgroundType = 'solid' | 'tr' | 'gr';
export type ErrorCorrection = 'L' | 'M' | 'Q' | 'H';
export type PreviewMode = 'preview' | 'qr';

export type QRData = {
  link: string;
  text: string;
  emailTo: string;
  emailSub: string;
  emailBody: string;
  phone: string;
  smsTo: string;
  smsMsg: string;
  vcFirst: string;
  vcLast: string;
  vcPhone: string;
  vcEmail: string;
  vcOrg: string;
  vcUrl: string;
  waPhone: string;
  waMsg: string;
  wSsid: string;
  wPass: string;
  wEnc: string;
  pdfUrl: string;
  appStore: string;
  appId: string;
  imgUrl: string;
  vidUrl: string;
  socialNet: string;
  socialUrl: string;
  evTitle: string;
  evStart: string;
  evEnd: string;
  evLoc: string;
  evDesc: string;
  barcodeData: string;
};

export type QRRenderState = {
  payload: string;
  dyn: boolean;
  dynId: string;
  dotShape: DotShape;
  dotColor: string;
  useGradient: boolean;
  dotColor2: string;
  gradDir: GradientDirection;
  bgType: BackgroundType;
  bgColor: string;
  bgColor2: string;
  bgDir: GradientDirection;
  eyeOuter: EyeOuter;
  eyeInner: EyeInner;
  useEyeColor: boolean;
  eyeOuterColor: string;
  eyeInnerColor: string;
  frameStyle: FrameStyle;
  frameColor: string;
  frameText: string;
  frameTextColor: string;
  logoType: string;
  ec: ErrorCorrection;
};

export type ContentTypeOption = {
  id: ContentType;
  label: string;
  Icon: ElementType;
};

export type SimpleOption<T extends string> = {
  id: T;
  label: string;
};

export type ColorPreset = {
  id: string;
  label: string;
  primary: string;
  secondary: string;
};

export type LogoOption = {
  id: string;
  label: string;
  bg: string;
  sym: string;
};