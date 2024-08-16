import { Component, ComponentClass } from './component';
import { container } from './ioc';

export class Router {
    private routes: Map<string, ComponentClass> = new Map();
    private currentComponent: Component | null = null;

    constructor(private container: HTMLElement) {
        window.addEventListener('popstate', this.handlePopState.bind(this));
    }

    addRoute(path: string, component: ComponentClass) {
        this.routes.set(path, component);
    }

    navigateTo(path: string) {
        history.pushState(null, '', path);
        this.renderComponent(path);
    }

    start() {
        this.renderComponent(window.location.pathname);
    }

    private renderComponent(path: string) {
        const ComponentClass = this.routes.get(path);
        if (ComponentClass) {
            if (this.currentComponent) {
                this.currentComponent.unmount();
            }
            // Use the container to resolve the component
            this.currentComponent = container.resolve<Component>(ComponentClass);
            this.currentComponent.mount(this.container);
        } else {
            console.error(`No route found for ${path}`);
        }
    }

    private handlePopState() {
        this.renderComponent(window.location.pathname);
    }
}