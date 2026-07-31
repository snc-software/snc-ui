/**
 * Open popouts, oldest first.
 *
 * Module-level because nesting is a relationship *between* popouts that no single instance can see
 * from its own props, and each panel is portalled to `document.body` — so a nested panel is not a DOM
 * descendant of its parent's and `contains` reads it as "outside". Stack order carries the
 * relationship the DOM tree has lost.
 *
 * Entries are removed by the cleanup their registration returned, so the stack drains on unmount.
 */
const layers: HTMLElement[] = [];

export function registerLayer(panel: HTMLElement): () => void {
  layers.push(panel);

  return () => {
    const index = layers.indexOf(panel);

    if (index !== -1) {
      layers.splice(index, 1);
    }
  };
}

export function isTopmostLayer(panel: HTMLElement): boolean {
  return layers[layers.length - 1] === panel;
}

/**
 * Whether `target` sits inside a popout stacked above `panel` — what stops a parent dismissing itself
 * when the user interacts with a popout nested inside it.
 */
export function isWithinLayerAbove(panel: HTMLElement, target: Node): boolean {
  const index = layers.indexOf(panel);

  if (index === -1) {
    return false;
  }

  return layers.slice(index + 1).some((layer) => layer.contains(target));
}
