import 'reflect-metadata';
import { App } from 'framework/app';
import { HomeComponent } from 'components/home.component';
import { ProfileComponent } from 'components/profile.component';

console.log('Application starting...');

window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', { message, source, lineno, colno, error });
    return false;
};

  // Bootstrap the application
const app = new App(document.getElementById('app')!);
app.addRoute('/', HomeComponent);
app.addRoute('/profile', ProfileComponent);
app.start();
