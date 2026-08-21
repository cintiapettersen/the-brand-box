/**
 * Remove o fundo branco de uma imagem em base64 e retorna uma imagem PNG transparente.
 * Suporta navegador via HTML5 Canvas com suavização alfa (antialiasing) nas bordas.
 */
export async function removeWhiteBackground(base64OrDataUri, threshold = 230) {
  if (!base64OrDataUri) return null;
  if (typeof window === 'undefined') {
    return base64OrDataUri.startsWith('data:') 
      ? base64OrDataUri 
      : `data:image/png;base64,${base64OrDataUri}`;
  }

  const src = base64OrDataUri.startsWith('data:')
    ? base64OrDataUri
    : `data:image/png;base64,${base64OrDataUri}`;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 512;
        canvas.height = img.naturalHeight || img.height || 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Brilho médio do pixel
          const brightness = (r + g + b) / 3;

          // Se for branco puro ou muito próximo (> 242), 100% transparente
          if (brightness >= 242 && r > 230 && g > 230 && b > 230) {
            data[i + 3] = 0;
          } 
          // Zona de transição (antialiasing suave entre 210 e 242)
          else if (brightness > 210 && r > 200 && g > 200 && b > 200) {
            const factor = (242 - brightness) / (242 - 210); // 0 a 1
            data[i + 3] = Math.round(data[i + 3] * factor);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const transparentDataUri = canvas.toDataURL('image/png');
        resolve(transparentDataUri);
      } catch (err) {
        console.warn('[transparentImage] Falha ao processar canvas, usando fallback:', err);
        resolve(src);
      }
    };
    img.onerror = () => {
      resolve(src);
    };
    img.src = src;
  });
}
