// Import the reflect-metadata library, which allows us to add and read metadata
import 'reflect-metadata';

// Define a generic type for a constructor function
// This represents any class constructor that can be instantiated with 'new'
type Constructor<T = any> = new (...args: any[]) => T;

// Define a union type for dependency tokens
// A token can be either a constructor function or a string identifier
type Token<T = any> = Constructor<T> | string;

// Define the main Container class for dependency injection
export class Container {
    // Map to store all registered dependencies
    private dependencies: Map<any, any> = new Map();

    // Method to register a dependency
    public register<T>(token: Token<T>, instanceOrFactory?: T | (() => T)): void {

        if (instanceOrFactory === undefined) {
            // If no instance or factory is provided, we're doing auto-registration
            // We store the token itself as the dependency
            this.dependencies.set(token, token);
        } else if (typeof instanceOrFactory === 'function' && !this.isConstructor(instanceOrFactory)) {
            // If it's a function but not a constructor, it's a factory function
            // We store the factory function
            this.dependencies.set(token, instanceOrFactory as () => T);
        } else {
            // Otherwise, it's either an instance or a class constructor
            // We store it as-is
            this.dependencies.set(token, instanceOrFactory);
        }
    }

    // Method to resolve a dependency
    public resolve<T>(token: Token<T>): T {
        // Try to get the dependency from our map
        let dependency = this.dependencies.get(token);
        if (!dependency) {
            // If the dependency isn't found and the token is a function (class constructor)
            if (typeof token === 'function') {
                // Auto-register the class
                this.register(token);
                dependency = this.dependencies.get(token);
            } else {
                // If it's not a function and not registered, we can't resolve it
                throw new Error(`No provider for ${this.getTokenName(token)}`);
            }
        }

        if (typeof dependency === 'function') {

            // If the dependency is a function, it could be a class constructor or factory function
            if (this.isConstructor(dependency)) {
                // It's a class constructor
                // Resolve any dependencies of this class
                const injections = this.resolveInjections(dependency);
                // Create a new instance with the resolved dependencies
                return new (dependency as Constructor<T>)(...injections);
            } else {
                // It's a factory function
                // Call the factory function to get the instance
                return (dependency as () => T)();
            }
        }

        // If it's not a function, it must be an instance, so we return it directly
        return dependency as T;
    }

    // Method to resolve the dependencies of a class
    private resolveInjections(target: any): any[] {

        // Get the types of the constructor parameters
        const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];

        // Get any custom injection metadata
        const injections = Reflect.getOwnMetadata(INJECT_METADATA_KEY, target) || [];

        // Determine how many dependencies we need to resolve
        const length = Math.max(paramTypes.length, injections.length);

        // Resolve each dependency
        return Array(length).fill(null).map((_, index) => {

            // Use custom injection token if available, otherwise use parameter type
            const injectionToken = injections[index] || paramTypes[index];

            if (injectionToken) {
                const resolved = this.resolve(injectionToken);
                return resolved;
            }

            throw new Error(`Cannot resolve parameter at index ${index} for ${target.name}`);
        });
    }

    // Helper method to get a readable name for a token
    private getTokenName(token: Token): string {
        if (typeof token === 'function') {
            return token.name;
        }
        return token;
    }

    // Helper method to check if a function is a constructor
    private isConstructor(func: Function): boolean {
        return !!func.prototype && !!func.prototype.constructor.name;
    }
}

// Create a single instance of the Container to be used throughout the application
export const container = new Container();

// Decorator factory for marking a class as injectable
export function Injectable() {
    return function (target: Constructor) {
        container.register(target);
    };
}

// Symbol to use as a key for storing and retrieving custom injection metadata
const INJECT_METADATA_KEY = Symbol("INJECT_METADATA_KEY");

// Decorator factory for specifying custom injection tokens for constructor parameters
export function Inject(token: any) {
    return function (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
        // Get existing injections or initialize an empty array
        const existingInjections = Reflect.getOwnMetadata(INJECT_METADATA_KEY, target) || [];
        // Add the custom injection token for this parameter
        existingInjections[parameterIndex] = token;
        // Store the updated injections metadata
        Reflect.defineMetadata(INJECT_METADATA_KEY, existingInjections, target);
    };
}