import type {
    DotShape,
    EyeInner,
    EyeOuter,
    FrameStyle,
    GradientDirection,
    QRRenderState,
  } from './types';
  import { LOGOS } from './constants';
  
  declare global {
    interface Window {
      qrcode?: (
        typeNumber: number,
        errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
      ) => {
        addData: (data: string) => void;
        make: () => void;
        getModuleCount: () => number;
        isDark: (row: number, col: number) => boolean;
      };
    }
  }
  
  export function ensureQrEngine(onReady: () => void) {
    if (window.qrcode) {
      onReady();
      return;
    }
  
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-qr-engine="qrcode-generator"]'
    );
  
    if (existing) {
      existing.addEventListener('load', onReady, { once: true });
      return;
    }
  
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
    script.dataset.qrEngine = 'qrcode-generator';
    script.onload = onReady;
    document.head.appendChild(script);
  }
  
  function drawMod(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    shape: DotShape
  ) {
    const p = size * 0.09;
    const sx = x + p;
    const sy = y + p;
    const ss = size - p * 2;
    const cx = sx + ss / 2;
    const cy = sy + ss / 2;
    const r = ss / 2;
  
    ctx.beginPath();
  
    if (shape === 'square') {
      ctx.rect(sx, sy, ss, ss);
    } else if (shape === 'rounded') {
      ctx.roundRect(sx, sy, ss, ss, ss * 0.28);
    } else if (shape === 'circle') {
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
    } else if (shape === 'diamond') {
      ctx.moveTo(cx, sy);
      ctx.lineTo(sx + ss, cy);
      ctx.lineTo(cx, sy + ss);
      ctx.lineTo(sx, cy);
      ctx.closePath();
    } else if (shape === 'star') {
      const outer = r * 0.95;
      const inner = r * 0.38;
  
      for (let i = 0; i < 10; i += 1) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const radius = i % 2 === 0 ? outer : inner;
        const px = cx + radius * Math.cos(angle);
        const py = cy + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    } else if (shape === 'cross') {
      const w = ss * 0.3;
      const h = ss;
      const hx = cx - h / 2;
      const hy = cy - h / 2;
  
      ctx.moveTo(cx - w / 2, hy);
      ctx.lineTo(cx + w / 2, hy);
      ctx.lineTo(cx + w / 2, cy - w / 2);
      ctx.lineTo(hx + h, cy - w / 2);
      ctx.lineTo(hx + h, cy + w / 2);
      ctx.lineTo(cx + w / 2, cy + w / 2);
      ctx.lineTo(cx + w / 2, hy + h);
      ctx.lineTo(cx - w / 2, hy + h);
      ctx.lineTo(cx - w / 2, cy + w / 2);
      ctx.lineTo(hx, cy + w / 2);
      ctx.lineTo(hx, cy - w / 2);
      ctx.lineTo(cx - w / 2, cy - w / 2);
      ctx.closePath();
    } else if (shape === 'heart') {
      const hs = r * 0.62;
      ctx.moveTo(cx, cy + hs);
      ctx.bezierCurveTo(
        cx - hs * 0.2,
        cy + hs * 0.7,
        cx - hs * 1.3,
        cy + hs * 0.4,
        cx - hs * 1.2,
        cy - hs * 0.1
      );
      ctx.bezierCurveTo(
        cx - hs * 1.1,
        cy - hs * 0.8,
        cx - hs * 0.4,
        cy - hs * 0.9,
        cx,
        cy - hs * 0.3
      );
      ctx.bezierCurveTo(
        cx + hs * 0.4,
        cy - hs * 0.9,
        cx + hs * 1.1,
        cy - hs * 0.8,
        cx + hs * 1.2,
        cy - hs * 0.1
      );
      ctx.bezierCurveTo(
        cx + hs * 1.3,
        cy + hs * 0.4,
        cx + hs * 0.2,
        cy + hs * 0.7,
        cx,
        cy + hs
      );
      ctx.closePath();
    } else {
      ctx.moveTo(cx, sy);
      ctx.quadraticCurveTo(sx + ss, cy, cx, sy + ss);
      ctx.quadraticCurveTo(sx, cy, cx, sy);
      ctx.closePath();
    }
  
    ctx.fill();
  }
  
  function fillBackgroundCutout(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    bgColor: string,
    transparent: boolean,
    radius = 0
  ) {
    if (transparent) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = '#000';
      if (radius) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, radius);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, w, h);
      }
      ctx.restore();
      return;
    }
  
    ctx.fillStyle = bgColor;
    if (radius) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.fill();
    } else {
      ctx.fillRect(x, y, w, h);
    }
  }
  
  function drawEyeOuter(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cell: number,
    style: EyeOuter,
    fg: string,
    bg: string,
    transparent: boolean
  ) {
    const size = 7 * cell;
    const inner = 5 * cell;
    const cx = x + size / 2;
    const cy = y + size / 2;
  
    ctx.fillStyle = fg;
  
    if (style === 'rnd') {
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, size * 0.22);
      ctx.fill();
      fillBackgroundCutout(
        ctx,
        x + cell,
        y + cell,
        inner,
        inner,
        bg,
        transparent,
        inner * 0.12
      );
    } else if (style === 'cir') {
      ctx.beginPath();
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
      ctx.fill();
  
      if (transparent) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(cx, cy, inner / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(cx, cy, inner / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (style === 'dbl') {
      ctx.fillRect(x, y, size, size);
      fillBackgroundCutout(ctx, x + cell, y + cell, inner, inner, bg, transparent);
      ctx.fillStyle = fg;
      ctx.fillRect(
        x + cell * 1.35,
        y + cell * 1.35,
        inner - cell * 0.7,
        inner - cell * 0.7
      );
      fillBackgroundCutout(
        ctx,
        x + 2 * cell,
        y + 2 * cell,
        3 * cell,
        3 * cell,
        bg,
        transparent
      );
    } else if (style === 'brk') {
      const bw = cell;
      const bl = 2.5 * cell;
      const pieces = [
        [x, y, bl, bw],
        [x, y, bw, bl],
        [x + size - bl, y, bl, bw],
        [x + size - bw, y, bw, bl],
        [x, y + size - bw, bl, bw],
        [x, y + size - bl, bw, bl],
        [x + size - bl, y + size - bw, bl, bw],
        [x + size - bw, y + size - bl, bw, bl],
      ];
  
      pieces.forEach(([rx, ry, rw, rh]) => ctx.fillRect(rx, ry, rw, rh));
    } else if (style === 'dia') {
      ctx.beginPath();
      ctx.moveTo(cx, y);
      ctx.lineTo(x + size, cy);
      ctx.lineTo(cx, y + size);
      ctx.lineTo(x, cy);
      ctx.closePath();
      ctx.fill();
  
      if (transparent) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(cx, y + cell);
        ctx.lineTo(x + size - cell, cy);
        ctx.lineTo(cx, y + size - cell);
        ctx.lineTo(x + cell, cy);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.moveTo(cx, y + cell);
        ctx.lineTo(x + size - cell, cy);
        ctx.lineTo(cx, y + size - cell);
        ctx.lineTo(x + cell, cy);
        ctx.closePath();
        ctx.fill();
      }
    } else if (style === 'dts') {
      for (let row = 0; row < 7; row += 1) {
        for (let col = 0; col < 7; col += 1) {
          if (row === 0 || row === 6 || col === 0 || col === 6) {
            ctx.beginPath();
            ctx.arc(
              x + col * cell + cell / 2,
              y + row * cell + cell / 2,
              cell * 0.42,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }
      }
    } else if (style === 'shld') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size, y + size * 0.65);
      ctx.lineTo(cx, y + size);
      ctx.lineTo(x, y + size * 0.65);
      ctx.closePath();
      ctx.fill();
      fillBackgroundCutout(
        ctx,
        x + cell,
        y + cell,
        inner,
        inner * 0.5,
        bg,
        transparent
      );
    } else {
      ctx.fillRect(x, y, size, size);
      fillBackgroundCutout(ctx, x + cell, y + cell, inner, inner, bg, transparent);
    }
  }
  
  function drawEyeInner(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cell: number,
    style: EyeInner,
    color: string,
    bg: string,
    transparent: boolean
  ) {
    const ix = x + 2 * cell;
    const iy = y + 2 * cell;
    const size = 3 * cell;
    const cx = ix + size / 2;
    const cy = iy + size / 2;
    const r = size / 2;
  
    ctx.fillStyle = color;
    ctx.beginPath();
  
    if (style === 'rnd') {
      ctx.roundRect(ix, iy, size, size, size * 0.28);
      ctx.fill();
      return;
    }
  
    if (style === 'cir') {
      ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
  
    if (style === 'dia') {
      ctx.moveTo(cx, iy);
      ctx.lineTo(ix + size, cy);
      ctx.lineTo(cx, iy + size);
      ctx.lineTo(ix, cy);
      ctx.closePath();
      ctx.fill();
      return;
    }
  
    if (style === 'str') {
      const outer = r * 0.9;
      const inner = r * 0.38;
      for (let i = 0; i < 10; i += 1) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const radius = i % 2 === 0 ? outer : inner;
        const px = cx + radius * Math.cos(angle);
        const py = cy + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      return;
    }
  
    if (style === 'crs') {
      drawMod(ctx, ix, iy, size, 'cross');
      return;
    }
  
    if (style === 'rng') {
      ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2);
      ctx.fill();
  
      if (transparent) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.44, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.44, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }
  
    if (style === 'hrt') {
      drawMod(ctx, ix, iy, size, 'heart');
      return;
    }
  
    ctx.rect(ix, iy, size, size);
    ctx.fill();
  }
  
  function getFramePad(frame: FrameStyle): [number, number, number, number] {
    const map: Record<FrameStyle, [number, number, number, number]> = {
      none: [0, 0, 0, 0],
      thin: [10, 10, 10, 10],
      round: [14, 14, 14, 14],
      dbl: [18, 18, 18, 18],
      scan: [22, 22, 22, 22],
      lblb: [10, 10, 52, 10],
      lblt: [52, 10, 10, 10],
      pol: [16, 16, 60, 16],
      badge: [20, 20, 20, 20],
      cert: [38, 38, 38, 38],
    };
  
    return map[frame];
  }
  
  function buildGradient(
    ctx: CanvasRenderingContext2D,
    direction: GradientDirection,
    x: number,
    y: number,
    w: number,
    h: number,
    c1: string,
    c2: string
  ) {
    let gradient: CanvasGradient;
  
    if (direction === 'h') {
      gradient = ctx.createLinearGradient(x, y, x + w, y);
    } else if (direction === 'v') {
      gradient = ctx.createLinearGradient(x, y, x, y + h);
    } else if (direction === 'rad') {
      gradient = ctx.createRadialGradient(
        x + w / 2,
        y + h / 2,
        0,
        x + w / 2,
        y + h / 2,
        w / 2
      );
    } else {
      gradient = ctx.createLinearGradient(x, y, x + w, y + h);
    }
  
    gradient.addColorStop(0, c1);
    gradient.addColorStop(1, c2);
    return gradient;
  }
  
  function drawFrame(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: FrameStyle,
    frameColor: string,
    frameText: string,
    frameTextColor: string
  ) {
    if (frame === 'none') return;
  
    ctx.save();
  
    if (frame === 'thin') {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, width - 2, height - 2);
    } else if (frame === 'round') {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(2, 2, width - 4, height - 4, 16);
      ctx.stroke();
    } else if (frame === 'dbl') {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(2, 2, width - 4, height - 4);
      ctx.strokeRect(7, 7, width - 14, height - 14);
    } else if (frame === 'scan') {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 4;
      ctx.lineCap = 'square';
  
      [
        [2, 2],
        [width - 2, 2],
        [2, height - 2],
        [width - 2, height - 2],
      ].forEach(([x, y]) => {
        const dx = x < width / 2 ? 1 : -1;
        const dy = y < height / 2 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(x + dx * 28, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y + dy * 28);
        ctx.stroke();
      });
    } else if (frame === 'lblb' || frame === 'pol') {
      const labelHeight = frame === 'pol' ? 60 : 52;
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, height - labelHeight, width, labelHeight);
      ctx.fillStyle = frameTextColor;
      ctx.font = 'bold 18px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(frameText || 'SCAN ME', width / 2, height - labelHeight / 2);
    } else if (frame === 'lblt') {
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, width, 52);
      ctx.fillStyle = frameTextColor;
      ctx.font = 'bold 18px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(frameText || 'SCAN ME', width / 2, 26);
    } else if (frame === 'badge') {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(2, 2, width - 4, height - 4, 22);
      ctx.stroke();
    } else if (frame === 'cert') {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, width - 8, height - 8);
      ctx.strokeRect(10, 10, width - 20, height - 20);
    }
  
    ctx.restore();
  }
  
  function drawCenterLogo(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    qrSize: number,
    logoType: string,
    frameColor: string,
    customImage: HTMLImageElement | null
  ) {
    if (logoType === 'none') return;
  
    const size = qrSize * 0.2;
  
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(
      cx - size * 0.72,
      cy - size * 0.72,
      size * 1.44,
      size * 1.44,
      size * 0.22
    );
    ctx.fill();
  
    if (logoType === 'scanme') {
      ctx.fillStyle = frameColor;
      ctx.beginPath();
      ctx.roundRect(
        cx - size * 0.65,
        cy - size * 0.65,
        size * 1.3,
        size * 1.3,
        size * 0.18
      );
      ctx.fill();
  
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${size * 0.34}px Inter, system-ui, sans-serif`;
      ctx.fillText('SCAN', cx, cy - size * 0.12);
      ctx.font = `bold ${size * 0.26}px Inter, system-ui, sans-serif`;
      ctx.fillText('ME', cx, cy + size * 0.26);
      return;
    }
  
    if (logoType === 'upload' && customImage?.complete) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(
        cx - size * 0.65,
        cy - size * 0.65,
        size * 1.3,
        size * 1.3,
        size * 0.18
      );
      ctx.clip();
      ctx.drawImage(
        customImage,
        cx - size * 0.65,
        cy - size * 0.65,
        size * 1.3,
        size * 1.3
      );
      ctx.restore();
      return;
    }
  
    const logo = LOGOS.find((item) => item.id === logoType);
    if (!logo || logo.bg === 'transparent') return;
  
    ctx.fillStyle = logo.bg;
    ctx.beginPath();
    ctx.roundRect(
      cx - size * 0.65,
      cy - size * 0.65,
      size * 1.3,
      size * 1.3,
      size * 0.18
    );
    ctx.fill();
  
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `bold ${size * 0.52}px Inter, system-ui, sans-serif`;
    ctx.fillText(logo.sym, cx, cy + 1);
  }
  
  export function renderQR(
    canvas: HTMLCanvasElement,
    state: QRRenderState,
    logoImage: HTMLImageElement | null
  ) {
    if (!window.qrcode) return;
  
    const payload = state.dyn ? `https://qrs.to/${state.dynId}` : state.payload;
    if (!payload.trim()) return;
  
    let matrix: boolean[][];
    let moduleCount: number;
  
    try {
      const correction =
        state.logoType !== 'none' && state.logoType !== 'scanme' ? 'H' : state.ec;
      const qr = window.qrcode(0, correction);
      qr.addData(payload);
      qr.make();
  
      moduleCount = qr.getModuleCount();
      matrix = Array.from({ length: moduleCount }, (_, row) =>
        Array.from({ length: moduleCount }, (_, col) => qr.isDark(row, col))
      );
    } catch {
      return;
    }
  
    const qrSize = 320;
    const cell = qrSize / moduleCount;
    const [topPad, rightPad, bottomPad, leftPad] = getFramePad(state.frameStyle);
    const width = qrSize + leftPad + rightPad;
    const height = qrSize + topPad + bottomPad;
    const scale = 2;
  
    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, width, height);
  
    const qx = leftPad;
    const qy = topPad;
    const transparent = state.bgType === 'tr';
  
    if (!transparent) {
      ctx.fillStyle =
        state.bgType === 'gr'
          ? buildGradient(
              ctx,
              state.bgDir,
              0,
              0,
              width,
              height,
              state.bgColor,
              state.bgColor2
            )
          : state.bgColor;
      ctx.fillRect(0, 0, width, height);
    }
  
    const isEye = (row: number, col: number) =>
      (row < 7 && col < 7) ||
      (row < 7 && col >= moduleCount - 7) ||
      (row >= moduleCount - 7 && col < 7);
  
    if (state.useGradient) {
      const mask = document.createElement('canvas');
      mask.width = width * scale;
      mask.height = height * scale;
      const maskCtx = mask.getContext('2d');
      if (!maskCtx) return;
  
      maskCtx.scale(scale, scale);
      maskCtx.fillStyle = '#000000';
  
      for (let row = 0; row < moduleCount; row += 1) {
        for (let col = 0; col < moduleCount; col += 1) {
          if (matrix[row][col] && !isEye(row, col)) {
            drawMod(maskCtx, qx + col * cell, qy + row * cell, cell, state.dotShape);
          }
        }
      }
  
      const gradientCanvas = document.createElement('canvas');
      gradientCanvas.width = width * scale;
      gradientCanvas.height = height * scale;
      const gradientCtx = gradientCanvas.getContext('2d');
      if (!gradientCtx) return;
  
      gradientCtx.fillStyle = buildGradient(
        gradientCtx,
        state.gradDir,
        qx * scale,
        qy * scale,
        qrSize * scale,
        qrSize * scale,
        state.dotColor,
        state.dotColor2
      );
      gradientCtx.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);
      gradientCtx.globalCompositeOperation = 'destination-in';
      gradientCtx.drawImage(mask, 0, 0);
      ctx.drawImage(gradientCanvas, 0, 0, width, height);
    } else {
      ctx.fillStyle = state.dotColor;
  
      for (let row = 0; row < moduleCount; row += 1) {
        for (let col = 0; col < moduleCount; col += 1) {
          if (matrix[row][col] && !isEye(row, col)) {
            drawMod(ctx, qx + col * cell, qy + row * cell, cell, state.dotShape);
          }
        }
      }
    }
  
    const outerColor = state.useEyeColor ? state.eyeOuterColor : state.dotColor;
  
    [
      [0, 0],
      [0, moduleCount - 7],
      [moduleCount - 7, 0],
    ].forEach(([row, col]) => {
      const ex = qx + col * cell;
      const ey = qy + row * cell;
      drawEyeOuter(ctx, ex, ey, cell, state.eyeOuter, outerColor, state.bgColor, transparent);
      drawEyeInner(
        ctx,
        ex,
        ey,
        cell,
        state.eyeInner,
        state.eyeInnerColor,
        state.bgColor,
        transparent
      );
    });
  
    drawFrame(
      ctx,
      width,
      height,
      state.frameStyle,
      state.frameColor,
      state.frameText,
      state.frameTextColor
    );
  
    drawCenterLogo(
      ctx,
      qx + qrSize / 2,
      qy + qrSize / 2,
      qrSize,
      state.logoType,
      state.frameColor,
      logoImage
    );
  
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }