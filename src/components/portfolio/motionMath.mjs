export function videoTimeAtProgress(progress, duration) {
  if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(progress)) return 0;
  return Math.min(Math.max(0, duration - .04), Math.max(0, progress) * duration);
}
export function boundedProjectIndex(index, direction, count) {
  return Math.min(Math.max(0, count - 1), Math.max(0, index + direction));
}
export function galleryWheelDistance(delta, mode, cardWidth) {
  const pixels = delta * (mode === 1 ? 40 : mode === 2 ? 800 : 1);
  return Math.max(-cardWidth, Math.min(cardWidth, pixels * .06));
}
export function nearestGalleryTarget(index, current, width, count) {
  const cycle = width * count;
  const base = width * index;
  return cycle > 0 ? base + Math.round((current - base) / cycle) * cycle : 0;
}
export function galleryDragDistance(startX, startY, x, y, previous) {
  return Math.max(previous, Math.hypot(x - startX, y - startY));
}
export function sceneStateAtScroll(scroll, sectionTops, viewportHeight) {
  for (let index = sectionTops.length - 1; index > 0; index--) {
    const start = sectionTops[index] - viewportHeight * .85;
    const end = sectionTops[index] - viewportHeight * .25;
    if (scroll >= end) return { from: index, to: index, blend: 0 };
    if (scroll >= start) return { from: index - 1, to: index, blend: (scroll - start) / (end - start) };
  }
  return { from: 0, to: 0, blend: 0 };
}
// Each pose occupies one stop on a reversible timeline. The two visible
// silhouettes share opacity instead of keeping an opaque figure underneath.
export function layerPose(progress, index) {
 const offset=Math.max(-1,Math.min(1,progress-index));
 const distance=Math.abs(offset);
 const fade=1-distance;
 const opacity=fade*fade*(3-2*fade);
 const resting=[1,.91,.84,.88,.94][index] ?? .9;
 return {opacity, x:-offset*7, y:offset*-14, scale:resting-distance*.06};
}
