export function typescriptReactTemplate(
  // @ts-ignore
  { template },
  // @ts-ignore
  opts,
  // @ts-ignore
  state,
) {
  const { componentName, jsx } = state;

  const typeScriptTpl = template.smart({ plugins: ['typescript'] });

  return typeScriptTpl.ast`
${state.imports}

export const ${componentName} = (props: React.SVGProps<SVGSVGElement> & {color: string}) => {
  return ${jsx}
};
  `;
}

export function typescriptReactNativeTemplate(
  // @ts-ignore
  { template },
  // @ts-ignore
  opts,
  // @ts-ignore
  state,
) {
  const { componentName, jsx } = state;

  const typeScriptTpl = template.smart({ plugins: ['typescript'] });

  return typeScriptTpl.ast`
${state.imports}

export const ${componentName} = (props: React.ComponentProps<typeof Svg> & {color: string}) => {
  return ${jsx}
};
  `;
}
