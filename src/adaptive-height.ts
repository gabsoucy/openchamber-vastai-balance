export function observeAdaptiveHeight(
  element: HTMLElement,
  setHeight: (height: number) => Promise<void>,
  Observer: typeof ResizeObserver = ResizeObserver,
): { measure: () => void; dispose: () => void } {
  let desired: number | undefined;
  let requested: number | undefined;
  let inFlight = false;
  let disposed = false;

  const flush = () => {
    if (disposed || inFlight || desired === undefined || desired === requested) return;
    const height = desired;
    requested = height;
    inFlight = true;
    void setHeight(height).catch(() => {
      if (requested === height) requested = undefined;
    }).finally(() => {
      inFlight = false;
      if (!disposed && desired !== height) flush();
    });
  };

  const measure = () => {
    if (disposed) return;
    // Measure content, not the iframe/body: body height follows the host's last resize.
    desired = Math.ceil(element.getBoundingClientRect().height + 8);
    flush();
  };
  const observer = new Observer(measure);
  observer.observe(element);
  measure();
  return {
    measure,
    dispose() {
      disposed = true;
      observer.disconnect();
    },
  };
}
