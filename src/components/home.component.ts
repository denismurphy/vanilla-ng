import { Component } from "framework/component";
import { Injectable } from "/framework/ioc";

// Define a component
@Injectable()
export class HomeComponent extends Component {
    constructor() {
      super({
        template: '<h1>Welcome Home</h1>',
        styles: 'h1 { color: blue; }'
      });
    }
  }