/**
 * Minimal binary max-heap. Pops the item with the highest priority value
 * first. Used to drive the urgency-ordered matching queue.
 */
export default class MaxHeap {
  constructor(items = [], priorityFn = (x) => x) {
    this.priorityFn = priorityFn;
    this.heap = [];
    for (const item of items) this.push(item);
  }

  get size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  push(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    const top = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this._bubbleDown(0);
    }
    return top;
  }

  _bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.priorityFn(this.heap[index]) <= this.priorityFn(this.heap[parent])) break;
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  _bubbleDown(index) {
    const n = this.heap.length;
    while (true) {
      let largest = index;
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      if (left < n && this.priorityFn(this.heap[left]) > this.priorityFn(this.heap[largest])) {
        largest = left;
      }
      if (right < n && this.priorityFn(this.heap[right]) > this.priorityFn(this.heap[largest])) {
        largest = right;
      }
      if (largest === index) break;

      [this.heap[index], this.heap[largest]] = [this.heap[largest], this.heap[index]];
      index = largest;
    }
  }
}
