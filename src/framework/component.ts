import { Injectable } from "./ioc";

export type ComponentConfig = {
  template: string;
  styles?: string;
}

@Injectable()
export class Component {
  protected element: HTMLElement;

  constructor(config: ComponentConfig) {
    this.element = document.createElement('div');
    this.element.innerHTML = config.template;
    if (config.styles) {
      const style = document.createElement('style');
      style.textContent = config.styles;
      this.element.appendChild(style);
    }
  }

  mount(container: HTMLElement) {
    container.appendChild(this.element);
  }

  unmount() {
    this.element.remove();
  }
}

export type ComponentClass = new (...args: any[]) => Component;