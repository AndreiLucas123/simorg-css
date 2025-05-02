let styleSheet: CSSStyleSheet | null = null;

function ensureStyleSheet(): CSSStyleSheet {
  if (!styleSheet) {
    const styleTag = document.createElement('style');
    styleTag.id = 'css-components';
    document.head.appendChild(styleTag);
    styleSheet = styleTag.sheet as CSSStyleSheet;
  }
  return styleSheet;
}

//
//

let num = 0;

//
//

export function css(
  strings: TemplateStringsArray,
  ...interpolations: any[]
): string {
  // Gera a string final com interpolations
  let result = strings[0];
  for (let i = 0; i < interpolations.length; i++) {
    result += interpolations[i] + strings[i + 1];
  }

  const styleSheet = ensureStyleSheet();
  const className = 'css-' + ++num;

  styleSheet.insertRule(
    `.${className} { ${result} }`,
    styleSheet.cssRules.length,
  );

  return className;
}
