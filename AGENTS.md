<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Brand Box Briefing Design System & Color Palette

All briefing card grids (Área de Atuação, Sensações/Sentimentos, Elementos Visuais, O que NUNCA pensar, etc.) must follow these exact aesthetic guidelines:

- **Border Radius**: `20px` (`borderRadius: '20px'`)
- **Min Height**: `110px` (`minHeight: '110px'`)
- **Padding**: `18px 12px`
- **Container Headroom**: `padding: '16px 12px 22px 12px'`, `maxHeight: '52vh'`, `overflowY: 'auto'`
- **Typography**:
  - `fontFamily: "'Cinzel', 'Montserrat', -apple-system, sans-serif"`
  - `letterSpacing: '0.12em'`
  - `textTransform: 'uppercase'`
  - `fontSize: '0.73rem'`
  - `fontWeight: 600`
  - `lineHeight: 1.45`
- **Elevated 3D Shadow**:
  - Unselected: `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.04)`
  - Selected: `box-shadow: 0 12px 28px rgba(42, 137, 127, 0.35), 0 4px 10px rgba(0, 0, 0, 0.1)`
- **Selected Active State**:
  - `border: '3px solid var(--accent-turquoise)'`
  - `transform: 'translateY(-4px) scale(1.02)'`
  - Top-right white checkmark badge: `<span style={{ position: 'absolute', top: '8px', right: '8px', background: '#ffffff', color: '#1E293B', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.15)' }}>✓</span>`

## Official Briefing Palette Hex Codes (9 Grid Tones):
1. **Chalk Off-White**: `#FAFAFA` (Text: `#2A2A2A`)
2. **Soft Cream Sand**: `#F4E8DC` (Text: `#4A3A30`)
3. **Ice Pale Mint**: `#E1EDE7` (Text: `#203830`)
4. **Powder Blue Mist**: `#C9D7E5` (Text: `#1E2D3B`)
5. **Cashmere Taupe**: `#C7B49F` (Text: `#FFFFFF`)
6. **Dusty Lilac Mauve**: `#9B8B9B` (Text: `#FFFFFF`)
7. **Sage Herb Green**: `#8D9A87` (Text: `#FFFFFF`)
8. **Bone Warm White**: `#EFECE3` (Text: `#383630`)
9. **Obsidian Slate Charcoal**: `#515361` (Text: `#FFFFFF`)

