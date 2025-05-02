//
//

const rulesFixed: Record<string, string> = {
  flex: 'display:flex',
  'inline-flex': 'display:inline-flex',
  block: 'display:block',
  hidden: 'display:none',

  'flex-row': 'flex-direction:row',
  'flex-col': 'flex-direction:column',
  'flex-row-reverse': 'flex-direction:row-reverse',
  'flex-col-reverse': 'flex-direction:column-reverse',

  'items-start': 'align-items:flex-start',
  'items-center': 'align-items:center',
  'items-end': 'align-items:flex-end',
  'items-stretch': 'align-items:stretch',

  'justify-start': 'justify-content:flex-start',
  'justify-center': 'justify-content:center',
  'justify-end': 'justify-content:flex-end',
  'justify-between': 'justify-content:space-between',
  'justify-around': 'justify-content:space-around',
  'justify-evenly': 'justify-content:space-evenly',

  'w-full': 'width:100%',
  'h-full': 'height:100%',
  'w-screen': 'width:100vw',
  'h-screen': 'height:100vh',
  'min-w-full': 'min-width:100%',
  'min-h-full': 'min-height:100%',
  'max-w-full': 'max-width:100%',
  'max-h-full': 'max-height:100%',
  'self-center': 'align-self:center',
  'self-end': 'align-self:flex-end',
  'self-start': 'align-self:flex-start',
  'justify-self-end': 'justify-self:end',
  'justify-self-center': 'justify-self:center',
  'justify-self-start': 'justify-self:start',
  'overflow-auto': 'overflow:auto',
  'overflow-hidden': 'overflow:hidden',
  'overflow-scroll': 'overflow:scroll',
  'overflow-x-auto': 'overflow-x:auto',
  'overflow-y-auto': 'overflow-y:auto',
  'text-center': 'text-align:center',
  'text-left': 'text-align:left',
  'text-right': 'text-align:right',
  'font-bold': 'font-weight:700',
  'font-semibold': 'font-weight:600',
  'font-light': 'font-weight:300',
  uppercase: 'text-transform:uppercase',
  lowercase: 'text-transform:lowercase',
  capitalize: 'text-transform:capitalize',
  truncate: 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap',
  'whitespace-nowrap': 'white-space:nowrap',
  rounded: 'border-radius:0.25rem',
  'rounded-full': 'border-radius:9999px',
  'rounded-lg': 'border-radius:0.5rem',
  'rounded-md': 'border-radius:0.375rem',
  'rounded-sm': 'border-radius:0.125rem',
  shadow: 'box-shadow:0 1px 3px 0 rgba(0,0,0,0.1),0 1px 2px 0 rgba(0,0,0,0.06)',
  'shadow-md':
    'box-shadow:0 4px 6px -1px rgba(0,0,0,0.1),0 2px 4px -1px rgba(0,0,0,0.06)',
  'shadow-lg':
    'box-shadow:0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)',
  'shadow-sm': 'box-shadow:0 1px 2px 0 rgba(0,0,0,0.05)',
  'shadow-none': 'box-shadow:none',
  'p-px': 'padding:1px;',
};

// Regras variáveis baseadas em prefixo
const dynamicRules: Record<string, string | string[]> = {
  m: 'margin',
  mt: 'margin-top',
  mr: 'margin-right',
  mb: 'margin-bottom',
  ml: 'margin-left',
  mx: ['margin-left', 'margin-right'],
  my: ['margin-top', 'margin-bottom'],

  p: 'padding',
  pt: 'padding-top',
  pr: 'padding-right',
  pb: 'padding-bottom',
  pl: 'padding-left',
  px: ['padding-left', 'padding-right'],
  py: ['padding-top', 'padding-bottom'],

  w: 'width',
  h: 'height',
  'min-w': 'min-width',
  'min-h': 'min-height',
  'max-w': 'max-width',
  'max-h': 'max-height',

  gap: 'gap',
  'gap-x': 'column-gap',
  'gap-y': 'row-gap',
};

const baseSpacing = 0.25; // 1 unit = 0.25rem

/**
 * Gera uma string de estilos CSS inline a partir de classes inspiradas no Tailwind CSS.
 *
 * A função `stw` (acrônimo para "style tailwind") permite que você utilize classes no estilo do Tailwind
 * para aplicar rapidamente estilos inline em componentes Preact (ou React), sem a necessidade de instalar
 * ou configurar o Tailwind CSS na sua aplicação. Isso facilita ajustes rápidos de layout e estilização,
 * especialmente durante o desenvolvimento, permitindo que você escreva algo como:
 *
 * ```tsx
 * <div style={stw('flex flex-col')}>...</div>
 * ```
 * que será convertido para:
 * ```html
 * <div style="display: flex; flex-direction: column;">...</div>
 * ```
 *
 * A função processa uma string de classes separadas por espaço, verifica se cada classe corresponde a uma
 * regra fixa (`rulesFixed`) ou dinâmica (`dynamicRules`), e então gera a string de CSS correspondente.
 * Para regras dinâmicas, como espaçamentos (`mt-2`, `p-4`), ela calcula o valor em `rem` com base em um
 * valor base (`baseSpacing`). Caso a classe não seja reconhecida, um aviso é emitido no console.
 *
 * Essa abordagem é útil para prototipagem rápida e refatoração incremental, permitindo que você utilize
 * a conveniência das classes utilitárias do Tailwind sem depender do framework, e posteriormente migre
 * os estilos para classes CSS próprias conforme necessário.
 *
 * @param classesName Uma string contendo classes inspiradas no Tailwind, separadas por espaço.
 * @returns Uma string de estilos CSS inline correspondente às classes fornecidas.
 */
export function stw(classesName: string) {
  const classList = classesName.split(' ');
  let style = '';
  let splitted: string[] | undefined;

  for (const className of classList) {
    if (className === '') {
      continue;
    }

    if (className in rulesFixed) {
      style += rulesFixed[className] + ';';
      continue;
    }

    splitted = className.split('-');

    if (splitted.length < 2) {
      console.warn(`stw: "${className}" not found`);
      continue;
    }

    const valueStr = splitted.at(-1);
    if (!valueStr) {
      console.warn(`stw: "${className}" not found`);
      continue;
    }

    const value = baseSpacing * parseFloat(valueStr);

    if (isNaN(value)) {
      console.warn(`Invalid value for class "${className}"`);
      continue;
    }

    const prop = splitted.slice(0, -1).join('-');

    if (prop in dynamicRules) {
      const rule =
        dynamicRules[
          className.substring(0, className.length - (valueStr.length + 1))
        ];
      const value = baseSpacing * parseFloat(valueStr);

      if (isNaN(value)) {
        console.warn(`Invalid value for class "${className}"`);
        continue;
      }

      if (Array.isArray(rule)) {
        if (rule.length === 2) {
          style += `${rule[0]}:${value}rem;`;
          style += `${rule[1]}:${value}rem;`;
        }
      } else {
        style += `${rule}:${value}rem;`;
      }

      continue;
    }

    console.warn(`stw: "${className}" not found`);
  }

  return style;
}
