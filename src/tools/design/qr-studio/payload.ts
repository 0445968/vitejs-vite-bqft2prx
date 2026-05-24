import type { ContentType, QRData } from './types';

export function buildPayload(type: ContentType, data: QRData) {
  const formatDate = (value: string) =>
    value ? `${value.replace(/[-:T]/g, '').slice(0, 15)}Z` : '';

  switch (type) {
    case 'link':
      return data.link || 'https://example.com';

    case 'text':
      return data.text || 'Hello World';

    case 'email':
      return `mailto:${data.emailTo}?subject=${encodeURIComponent(
        data.emailSub
      )}&body=${encodeURIComponent(data.emailBody)}`;

    case 'call':
      return `tel:${data.phone}`;

    case 'sms':
      return `SMSTO:${data.smsTo}:${data.smsMsg}`;

    case 'vcard':
      return `BEGIN:VCARD
VERSION:3.0
N:${data.vcLast};${data.vcFirst}
FN:${data.vcFirst} ${data.vcLast}
TEL:${data.vcPhone}
EMAIL:${data.vcEmail}
ORG:${data.vcOrg}
URL:${data.vcUrl}
END:VCARD`;

    case 'whatsapp':
      return `https://wa.me/${data.waPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
        data.waMsg
      )}`;

    case 'wifi':
      return `WIFI:S:${data.wSsid};T:${data.wEnc};P:${data.wPass};;`;

    case 'pdf':
      return data.pdfUrl || 'https://example.com/document.pdf';

    case 'app':
      return data.appStore === 'apple'
        ? `https://apps.apple.com/app/${data.appId || 'id000000'}`
        : `https://play.google.com/store/apps/details?id=${
            data.appId || 'com.example.app'
          }`;

    case 'image':
      return data.imgUrl || 'https://example.com/image.jpg';

    case 'video':
      return data.vidUrl || 'https://youtube.com/watch?v=example';

    case 'social':
      return data.socialUrl || `https://${data.socialNet}.com/yourprofile`;

    case 'event':
      return `BEGIN:VEVENT
SUMMARY:${data.evTitle}
DTSTART:${formatDate(data.evStart)}
DTEND:${formatDate(data.evEnd)}
LOCATION:${data.evLoc}
DESCRIPTION:${data.evDesc}
END:VEVENT`;

    case 'barcode':
      return data.barcodeData || 'BARCODE-001';

    default:
      return 'https://example.com';
  }
}