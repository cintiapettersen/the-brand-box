with open('src/app/[lang]/sucesso/page.js', 'r', encoding='utf-8') as f:
    content = f.read()

old = "  const setPatternScale = (v) => { setPatternScaleState(v); persistPapelaria({ patternScale: v }); };\n  const setBorderColor = (v) => { setBorderColorState(v); persistPapelaria({ borderColor: v }); };\n  const [showPrintModal, setShowPrintModal] = useState(false);"

new = """  const setBorderColor = (v) => { setBorderColorState(v); persistPapelaria({ borderColor: v }); };
  // Per-item patternScale overrides (tracks when user manually adjusts scale for each item)
  const [patternScaleOverrides, setPatternScaleOverrides] = React.useState({});
  // Auto-apply per-item default patternScale when switching items
  React.useEffect(() => {
    const item = itens[Math.min(idx, itens.length - 1)];
    if (!item) return;
    if (patternScaleOverrides[item] !== undefined) {
      setPatternScaleState(patternScaleOverrides[item]);
      return;
    }
    const entry = Object.entries(ITEM_DEFAULT_PATTERN_SCALE).find(([k]) =>
      item === k || item.includes(k) || k.includes(item.split('(')[0].trim())
    );
    if (entry) setPatternScaleState(entry[1]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);
  // setPatternScale also records per-item customization
  const setPatternScale = (v) => {
    const item = itens[Math.min(idx, itens.length - 1)];
    setPatternScaleState(v);
    persistPapelaria({ patternScale: v });
    if (item) setPatternScaleOverrides(prev => ({ ...prev, [item]: v }));
  };
  const [showPrintModal, setShowPrintModal] = useState(false);"""

if old in content:
    content = content.replace(old, new, 1)
    with open('src/app/[lang]/sucesso/page.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('SUCCESS: per-item default patternScale effect added')
else:
    print('ERROR: target text not found')
    idx2 = content.find('const setPatternScale = (v)')
    print(f'setPatternScale found at char: {idx2}')
    if idx2 >= 0:
        print(repr(content[idx2:idx2+200]))
