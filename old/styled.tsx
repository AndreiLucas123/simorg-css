import { h, type ComponentChildren, type JSX } from 'preact';

let styleSheet: CSSStyleSheet | null = null;

function ensureStyleSheet(): CSSStyleSheet {
  if (!styleSheet) {
    const styleTag = document.createElement('style');
    styleTag.id = 'styled-components';
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

type StyledFunction<T extends object> = (
  strings: TemplateStringsArray,
  ...interpolations: (string | number | ((props: T) => string | number))[]
) => (props: T & { children?: ComponentChildren }) => JSX.Element;

//
//

export const styled: {
  [K in keyof JSX.IntrinsicElements]: StyledFunction<JSX.IntrinsicElements[K]> &
    ((
      strings: TemplateStringsArray,
      ...interpolations: (
        | string
        | number
        | ((props: JSX.IntrinsicElements[K]) => string | number)
      )[]
    ) => (
      props: JSX.IntrinsicElements[K] & { children?: ComponentChildren },
    ) => JSX.Element);
} = new Proxy({} as any, {
  get(_, tag: string) {
    return (strings: TemplateStringsArray) => {
      let className = '';

      return function Styled(props: any) {
        if (className !== '') {
          return h(
            tag,
            {
              ...props,
              class: `${className} ${props.class || props.className || ''}`,
            },
            props.children,
          );
        }

        if (strings.length !== 1) {
          throw new Error(
            'Styled components must have a single template string, no interpolations',
          );
        }

        const styleSheet = ensureStyleSheet();

        className = 'styled-' + ++num;

        styleSheet.insertRule(
          `.${className} { ${strings[0]} }`,
          styleSheet.cssRules.length,
        );

        return h(
          tag,
          {
            ...props,
            class: `${className} ${props.class || props.className || ''}`,
          },
          props.children,
        );
      };
    };
  },
});
