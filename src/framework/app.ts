import { Router } from './router';
import { ComponentClass } from './component';

export class App {
    private router: Router;

    constructor(private container: HTMLElement) {
        this.router = new Router(container);
    }

    addRoute(path: string, component: ComponentClass) {
        this.router.addRoute(path, component);
    }

    start() {
        this.router.start();
    }
}