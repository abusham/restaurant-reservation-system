import type { DirectiveBinding, ObjectDirective } from "vue";

const clickOutsideSymbol = Symbol("click-outside");

export const vClickOutside: ObjectDirective = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const handler = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value(event);
      }
    };

    setTimeout(() => {
      document.addEventListener("click", handler, true);
    }, 0);
    (el as any)[clickOutsideSymbol] = handler;
  },

  unmounted(el: HTMLElement) {
    const handler = (el as any)[clickOutsideSymbol];
    if (handler) {
      document.removeEventListener("click", handler, true);
    }
  },
};
