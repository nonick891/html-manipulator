export const tofAppend = node =>
	tofNode(node) || tofShadowRoot(node);

export const tofShadowRoot = node =>
	node && node.constructor && node.constructor.name === 'ShadowRoot';

export const tofNode = node =>
	node instanceof Node;

export const tofStr = str =>
	typeof str === 'string';