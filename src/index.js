import { tofAppend, tofNode, tofStr, tofShadowRoot } from './type-check';

const getElOr = (element, selector) =>
	tofNode(element)
	? element
	: (bodySelector(tofStr(element) ? element : selector))

const bodySelector = selector =>
	document.body.querySelector(selector);

const safeSelect = (el, selector) => {
	if (!el && !selector) return false;
	if (tofShadowRoot(el) && tofShadowRoot(selector)) return el;
	if (tofShadowRoot(el) && tofStr(selector)) return el.querySelector(selector);
	if (el.isSameNode(selector)) return el;
	return el.querySelector(selector)
}

/**
 *
 * @param {HTMLIFrameElement} iframe
 * @returns {Document}
 */
const getContent = iframe =>
	iframe.contentDocument || iframe.contentWindow.document;

const appendElement = (obj, parent) =>
	appendChild(createElement(handleTag(obj)), parent);

const appendChild = (el, parent) =>
	tofAppend(parent) && tofNode(el) ? parent.appendChild(el) : false;

const createElement = obj =>
	fillProps(createChild(obj), obj, Boolean(obj.ns));

const createChild = obj => {
	let parent = create(obj);
	if (obj.child) obj.child.map(child => appendElement(child, parent));
	return parent;
};

const create = obj =>
	obj && obj.ns ? document.createElementNS(obj.ns, obj.tagName) : document.createElement(obj.tagName) ;

const handleTag = obj =>
	obj && obj.tagName ? obj : addTag(obj);

const addTag = obj =>
	Object.assign(getDivTag(), Boolean(obj) ? obj : {});

const getDivTag = () =>
	({ tagName: 'div' });

const fillProps = (e, props, ns = false) => {
	setHtml(e, props);
	clean(props);
	setAttrs(props, e, ns);
	return e;
};

const setHtml = (el, { html }) =>
	html ? el.prepend(document.createTextNode(html)) : false;

const clean = props =>
	['tagName', 'html', 'child', 'dom-link', 'link', 'ns'].map(n => delete props[n]);

const setAttrs = (props, e, ns) =>
	Object.keys(props).map(key => setAttr(e, key, props[key], ns));

const setAttr = (e, key, val, ns) => e.setAttribute(key, val);

const removeEl = el =>
	tofNode(el) && el.remove();

const removeEls = els =>
	Array.isArray(els) && els.map(removeEl);

const removeChildren = root =>
	root.hasChildNodes() && removeEls(root.childNodes);

const matches = (selector) =>
	(node) => node.matches(selector) || querySelector(node, selector);

const find = (array, selector) => {
	let el = array.find(matches(selector)),
		child = querySelector(el, selector);
	return child ? child : el;
};

const querySelector = (el, selector) =>
	el && el instanceof HTMLElement ? el.querySelector(selector) : false

const select = (array, selector) => {
	let filtered = array.filter(matches(selector));
	return filtered.map(el => {
		let child = querySelector(el, selector);
		return child ? child : el;
	});
};

export default {
	getElOr,
	safeSelect,
	getContent,
	appendElement,
	removeEl,
	removeEls,
	removeChildren,
	matches,
	find,
	querySelector,
	select
}