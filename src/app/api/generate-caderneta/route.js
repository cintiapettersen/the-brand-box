import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const hexToRgb = (hex, defaultHex = '#C03B66') => {
  const cleanHex = (hex || defaultHex).replace('#', '');
  const r = parseInt(cleanHex.substr(0,2), 16) / 255;
  const g = parseInt(cleanHex.substr(2,2), 16) / 255;
  const b = parseInt(cleanHex.substr(4,2), 16) / 255;
  return rgb(isNaN(r) ? 0.75 : r, isNaN(g) ? 0.23 : g, isNaN(b) ? 0.40 : b);
};

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      logoSrc,
      clinicaNome = '',
      slogan = '',
      crmLine = '',
      accentColor = '#C03B66',
      secondaryColor = '#E6C673',
      address = '',
      phone = '',
      instagram = '',
      email = '',
      site = ''
    } = body;

    // 1. Resolve booklet path
    const pdfPath = path.join(
      process.cwd(),
      'public',
      'Caderneta-EBOOK_ MAMAES & GESTANTES_sonho-de-papel designb(sem contorno) - Cintia P. Pettersen.pdf'
    );

    if (!fs.existsSync(pdfPath)) {
      return Response.json({ error: 'Arquivo base da caderneta não encontrado no servidor.' }, { status: 404 });
    }

    const basePdfBytes = fs.readFileSync(pdfPath);

    // 2. Load PDF document
    const pdfDoc = await PDFDocument.load(basePdfBytes);
    const pages = pdfDoc.getPages();
    const coverPage = pages[0];
    const backCoverPage = pages[pages.length - 1];

    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const mainColorRgb = hexToRgb(accentColor);
    const secColorRgb = hexToRgb(secondaryColor);

    // ── CUSTOMIZE PAGE 1 (COVER) ───────────────────────────────────
    if (coverPage) {
      const { width, height } = coverPage.getSize();

      // Draw standard clean cover background over the original
      coverPage.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(1, 1, 1),
      });

      // Draw custom background border/margin (similar to cover pattern/borders)
      const borderThickness = 12;
      coverPage.drawRectangle({
        x: 0,
        y: 0,
        width,
        height: borderThickness,
        color: mainColorRgb
      });
      coverPage.drawRectangle({
        x: 0,
        y: height - borderThickness,
        width,
        height: borderThickness,
        color: mainColorRgb
      });
      coverPage.drawRectangle({
        x: 0,
        y: 0,
        width: borderThickness,
        height,
        color: mainColorRgb
      });
      coverPage.drawRectangle({
        x: width - borderThickness,
        y: 0,
        width: borderThickness,
        height,
        color: mainColorRgb
      });

      // Draw dynamic custom logo if present
      if (logoSrc) {
        try {
          const imgData = logoSrc.split(',')[1] || logoSrc;
          const imgBuffer = Buffer.from(imgData, 'base64');
          let logoImage;
          if (logoSrc.includes('image/png')) {
            logoImage = await pdfDoc.embedPng(imgBuffer);
          } else {
            logoImage = await pdfDoc.embedJpg(imgBuffer);
          }

          const logoMaxW = width * 0.45;
          const logoImageScale = logoMaxW / logoImage.width;
          const logoW = logoImage.width * logoImageScale;
          const logoH = logoImage.height * logoImageScale;

          coverPage.drawImage(logoImage, {
            x: width / 2 - logoW / 2,
            y: height * 0.62,
            width: logoW,
            height: logoH
          });
        } catch (err) {
          console.error('Error embedding logo to PDF Cover:', err);
        }
      }

      // Draw dynamic texts
      const titleLine1 = 'CADERNETA DE';
      const titleLine2 = 'SAÚDE E DESENVOLVIMENTO';

      coverPage.drawText(titleLine1, {
        x: width / 2 - helveticaBold.widthOfTextAtSize(titleLine1, 14) / 2,
        y: height * 0.42,
        size: 14,
        font: helveticaBold,
        color: mainColorRgb
      });

      coverPage.drawText(titleLine2, {
        x: width / 2 - helveticaBold.widthOfTextAtSize(titleLine2, 22) / 2,
        y: height * 0.33,
        size: 22,
        font: helveticaBold,
        color: rgb(0.2, 0.2, 0.2)
      });

      // Draw custom tagline pill
      const cleanTagline = (slogan || 'CUIDADO INTEGRAL DA INFÂNCIA').toUpperCase();
      const taglineSize = 10;
      const tagW = helveticaBold.widthOfTextAtSize(cleanTagline, taglineSize) + 24;
      const tagH = 22;

      coverPage.drawRectangle({
        x: width / 2 - tagW / 2,
        y: height * 0.22,
        width: tagW,
        height: tagH,
        color: hexToRgb(secondaryColor)
      });

      coverPage.drawText(cleanTagline, {
        x: width / 2 - helveticaBold.widthOfTextAtSize(cleanTagline, taglineSize) / 2,
        y: height * 0.22 + 7,
        size: taglineSize,
        font: helveticaBold,
        color: rgb(1, 1, 1)
      });
    }

    // ── CUSTOMIZE PAGE 124 (BACK COVER) ───────────────────────────
    if (backCoverPage) {
      const { width, height } = backCoverPage.getSize();

      // Clean background
      backCoverPage.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(1, 1, 1),
      });

      // Draw matching border
      const borderThickness = 12;
      backCoverPage.drawRectangle({ x: 0, y: 0, width, height: borderThickness, color: mainColorRgb });
      backCoverPage.drawRectangle({ x: 0, y: height - borderThickness, width, height: borderThickness, color: mainColorRgb });
      backCoverPage.drawRectangle({ x: 0, y: 0, width: borderThickness, height, color: mainColorRgb });
      backCoverPage.drawRectangle({ x: width - borderThickness, y: 0, width: borderThickness, height, color: mainColorRgb });

      // Owner info
      const ownerLabel = 'ESTE DIÁRIO PERTENCE A:';
      backCoverPage.drawText(ownerLabel, {
        x: width / 2 - helveticaBold.widthOfTextAtSize(ownerLabel, 11) / 2,
        y: height * 0.72,
        size: 11,
        font: helveticaBold,
        color: mainColorRgb
      });

      // Draw dotted name line
      const lineY = height * 0.58;
      backCoverPage.drawLine({
        start: { x: width * 0.15, y: lineY },
        end: { x: width * 0.85, y: lineY },
        thickness: 1.5,
        color: rgb(0.85, 0.85, 0.85),
        dashArray: [4, 4]
      });

      // Branding Box
      const boxW = width * 0.82;
      const boxH = 90;
      const boxX = width / 2 - boxW / 2;
      const boxY = height * 0.20;

      backCoverPage.drawRectangle({
        x: boxX,
        y: boxY,
        width: boxW,
        height: boxH,
        color: rgb(0.98, 0.98, 0.98),
        borderColor: mainColorRgb,
        borderWidth: 0.5
      });

      const clinicaText = (clinicaNome || 'Sua Clínica').toUpperCase();
      backCoverPage.drawText(clinicaText, {
        x: width / 2 - helveticaBold.widthOfTextAtSize(clinicaText, 11) / 2,
        y: boxY + boxH - 22,
        size: 11,
        font: helveticaBold,
        color: mainColorRgb
      });

      const cleanAddress = address || 'Endereço não informado';
      backCoverPage.drawText(cleanAddress, {
        x: width / 2 - helvetica.widthOfTextAtSize(cleanAddress, 8) / 2,
        y: boxY + boxH - 38,
        size: 8,
        font: helvetica,
        color: rgb(0.5, 0.5, 0.5)
      });

      const phoneText = `Whatsapp/Telefone: ${phone || allPhones}`;
      backCoverPage.drawText(phoneText, {
        x: width / 2 - helveticaBold.widthOfTextAtSize(phoneText, 9) / 2,
        y: boxY + boxH - 58,
        size: 9,
        font: helveticaBold,
        color: rgb(0.2, 0.2, 0.2)
      });

      const footerLine = [instagram ? `@${instagram}` : '', email, site].filter(Boolean).join('  ·  ');
      backCoverPage.drawText(footerLine, {
        x: width / 2 - helvetica.widthOfTextAtSize(footerLine, 7.5) / 2,
        y: boxY + boxH - 76,
        size: 7.5,
        font: helvetica,
        color: rgb(0.6, 0.6, 0.6)
      });
    }

    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Caderneta_de_Saude_${(clinicaNome || 'Personalizada').replace(/\s+/g, '_')}.pdf"`,
      },
    });
  } catch (err) {
    console.error('API generate-caderneta error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
