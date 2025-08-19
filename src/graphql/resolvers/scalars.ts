import { GraphQLScalarType, Kind } from 'graphql';

function parseAst(ast: any): any {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      const value = Object.create(null);
      ast.fields.forEach((field: any) => {
        value[field.name.value] = parseAst(field.value);
      });
      return value;
    case Kind.LIST:
      return ast.values.map(parseAst);
    default:
      return null;
  }
}

export const JSONObjectResolver = new GraphQLScalarType({
  name: 'JSONObject',
  description: 'A JSON object',
  serialize: (value) => value,
  parseValue: (value) => value,
  parseLiteral: (ast) => {
    if (ast.kind === Kind.OBJECT) {
      const value = Object.create(null);
      ast.fields.forEach((field) => {
        value[field.name.value] = parseAst(field.value);
      });
      return value;
    }
    return parseAst(ast);
  }
});