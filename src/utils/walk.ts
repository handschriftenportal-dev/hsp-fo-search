export function walk(node: Node, fn: (node: Node) => void) {
  fn(node)
  node.childNodes.forEach((node) => walk(node, fn))
}
