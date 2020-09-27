// original author: devsnek

export function h(type, attributes, ...children) {
  return {
    type,
    attributes: attributes || {},
    children: children.flat()
  };
}

let currentComponent;
let currentRender;
const vnodeToComponent = new Map();

function innerRender(vnode) {
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(vnode);
  }

  let n;
  if (typeof vnode.type === "function") {
    if (!vnodeToComponent.has(vnode)) {
      vnodeToComponent.set(vnode, { stateMap: new Map() });
    }

    const lastComponent = currentComponent;
    currentComponent = vnodeToComponent.get(vnode);

    vnode.attributes.children = vnode.children;
    try {
      n = innerRender(vnode.type(vnode.attributes));
    } finally {
      currentComponent = lastComponent;
    }
  } else {
    n = document.createElement(vnode.type);
    Object.assign(n, vnode.attributes);
    n.append(...vnode.children.map((c) => innerRender(c)));
  }

  return n;
}

export function render(vnode, target) {
  let dirty = false;
  const markDirty = () => {
    if (dirty) {
      return;
    }
    dirty = true;
    requestAnimationFrame(() => {
      try {
        rerender();
      } finally {
        dirty = false;
      }
    });
  };

  const rerender = () => {
    const lastRender = currentRender;
    currentRender = { markDirty };

    try {
      const element = innerRender(vnode, rerender);
      target.replaceChild(element, target.firstChild);
    } finally {
      currentRender = lastRender;
    }
  };
  rerender();
}

export function useState(template, init) {
  const { stateMap } = currentComponent;
  const { markDirty } = currentRender;

  if (!stateMap.has(template)) {
    const s = [
      init,
      (v) => {
        s[0] = v;
        markDirty();
      }
    ];
    stateMap.set(template, s);
  }
  return stateMap.get(template);
}
