## Vite Plugin: cssStringPlugin

Este plugin para Vite permite extrair literais de template CSS (usando a tag `css`) de arquivos `.ts` e `.tsx`,
convertendo-os em identificadores de string e exportando o CSS para um módulo virtual. O objetivo é facilitar o uso
de CSS-in-JS de forma otimizada, mantendo o mapeamento de código-fonte (source map) para melhor experiência de desenvolvimento.

Funcionalidades:

- Remove automaticamente imports do tipo `import { css } from 'simorg-css'`.
- Substitui expressões `css\`...\`` por identificadores de string únicos baseados no nome do arquivo e da variável.
- Extrai o conteúdo CSS para um módulo virtual (ex: `css:FileName.css`), que é importado automaticamente no início do arquivo.
- Mantém o source map para facilitar debugging.
- Suporta atualização a quente (HMR) invalidando o CSS virtual correspondente ao arquivo alterado.

Exemplo de uso:

#### Antes (arquivo .tsx):

```tsx
import { css } from 'simorg-css';

const div = css`
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  * &:hover {
    background: #005bb5;
  }
  * &:active {
    background: #004499;
  }
`;

const button = css`
  color: white;
  padding: 10px 20px;
  border: ${'none'};
  border-radius: 5px;
  cursor: pointer;
`;
```

-

#### Depois do processamento:

```tsx
import 'css:FileName.css';
 *
const div = 'FileName_div';
 *
const button = 'FileName_button';
```

- O CSS extraído será disponibilizado em um módulo virtual, que pode ser manipulado pelo Vite e suas ferramentas.
- Detalhes técnicos:

* O plugin utiliza o Babel Parser para analisar o AST dos arquivos e MagicString para manipulação do código e geração de source maps.
* O CSS extraído é armazenado em memória e servido como um módulo virtual identificado por `css:FileName.css`.
* O nome do identificador CSS é composto pelo nome do arquivo e da variável, garantindo unicidade.
* O plugin é aplicado apenas a arquivos `.ts` e `.tsx`.

- Limitações:

* Apenas suporta literais de template diretamente atribuídos a variáveis (não suporta usos dinâmicos ou complexos).
* Não processa arquivos `.js` ou `.jsx`.
