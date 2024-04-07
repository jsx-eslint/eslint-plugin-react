import eslint from 'eslint';
import estree from 'estree';

declare global {
  interface ASTNode extends estree.BaseNode {
    [_: string]: any; // TODO: fixme
  }
  type Scope = eslint.Scope.Scope;
  type Token = eslint.AST.Token;
  type Fixer = eslint.Rule.RuleFixer;
  type JSXAttribute = ASTNode;
  type JSXElement = ASTNode;
  type JSXFragment = ASTNode;
  type JSXSpreadAttribute = ASTNode;

  type SourceCode = eslint.SourceCode & {
    getScope: (node: ASTNode) => Scope | null;
  };
  type Context = eslint.Rule.RuleContext & { sourceCode?: SourceCode };

  type TypeDeclarationBuilder = (annotation: ASTNode, parentName: string, seen: Set<typeof annotation>) => object;

  type TypeDeclarationBuilders = {
    [k in string]: TypeDeclarationBuilder;
  };

  type UnionTypeDefinition = {
    type: 'union' | 'shape';
    children: unknown[];
  };
}
