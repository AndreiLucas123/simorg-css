import { createFilter } from '@rollup/pluginutils';
import { basename, extname } from 'path';
import MagicString from 'magic-string';
import { parse } from '@babel/parser';
import { default as babelTraverse } from '@babel/traverse';
import type { Plugin } from 'vite';

/**
 * Vite Plugin: cssStringPlugin
 *
 * Veja detalhes e exemplos de uso no README.md deste pacote.
 */
export default function cssStringPlugin(): Plugin {
  const cssStore = new Map();
  const virtualPrefix = 'css:';
  const resolvedPrefix = '\0' + virtualPrefix;
  const fileToVirtualMap = new Map();

  const filter = createFilter(/\.tsx?$/);

  return {
    name: 'vite:css-string-plugin',
    enforce: 'pre', // Ajuda a garantir que seu transform rode cedo

    resolveId(id) {
      if (id.startsWith(virtualPrefix)) {
        return resolvedPrefix + id.slice(virtualPrefix.length);
      }
      return null;
    },

    load(id) {
      if (id.startsWith(resolvedPrefix)) {
        const fileKey = id.slice(resolvedPrefix.length);
        const css = cssStore.get(fileKey) || '';
        return {
          code: css,
          map: { mappings: '' },
        };
      }
      return null;
    },

    transform(code, id) {
      if (!filter(id)) return null;

      const ms = new MagicString(code);
      const ast = parse(code, {
        sourceType: 'module',
        plugins: ['typescript', 'jsx'],
      });

      const fileName = basename(id, extname(id));
      let hasCss = false;
      let collectedCss = '';

      babelTraverse.default(ast, {
        ImportDeclaration(path: any) {
          // Remove import { css } from './css'
          if (
            path.node.source.value.endsWith('/css') &&
            path.node.specifiers.some((s: any) => s.imported?.name === 'css')
          ) {
            ms.remove(path.node.start!, path.node.end!);
          }
        },
        TaggedTemplateExpression(path: any) {
          // Only transform css`...`
          if (path.node.tag.name !== 'css') return;

          const parent = path.parentPath.node;
          if (
            parent.type !== 'VariableDeclarator' ||
            parent.id.type !== 'Identifier'
          )
            return;

          const varName = parent.id.name;
          const identifier = `${fileName}_${varName}`;

          // Extract raw CSS text
          const raw = path.node.quasi.quasis
            .map((q: any) => q.value.raw)
            .join('${}');
          collectedCss += `.${identifier} { ${raw} }\n`;

          // Replace template expression with string literal
          ms.overwrite(
            path.node.start!,
            path.node.end!,
            JSON.stringify(identifier),
          );
          hasCss = true;
        },
      });

      if (hasCss) {
        const virtualId = `${virtualPrefix}${fileName}.css`;
        const resolvedVirtualId = resolvedPrefix + `${fileName}.css`;

        // Store virtual id for this file
        fileToVirtualMap.set(id, resolvedVirtualId);

        // Store new CSS content
        cssStore.set(fileName + '.css', collectedCss);

        // Let Vite know this transform adds a dependency
        this.addWatchFile(id);

        ms.prepend(`import '${virtualId}';\n`);

        return {
          code: ms.toString(),
          map: ms.generateMap({ hires: true }),
        };
      }

      return null;
    },

    handleHotUpdate({ file, server }) {
      // Invalida o módulo virtual correspondente ao arquivo alterado
      const resolvedVirtualId = fileToVirtualMap.get(file);
      if (resolvedVirtualId) {
        const mod = server.moduleGraph.getModuleById(resolvedVirtualId);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
        }
      }
    },
  };
}
