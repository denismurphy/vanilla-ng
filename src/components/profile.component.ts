import { Component } from "framework/component";
import { Inject, Injectable } from "framework/ioc";
import { UserService } from "services/user.service";

@Injectable()
export class ProfileComponent extends Component {

    constructor(@Inject(UserService) private userService: UserService) {
      super({
        template: '<h2>Profile</h2><p>Name: <span id="userName"></span></p>'
      });
    }
  
    mount(container: HTMLElement) {
      super.mount(container);
      const user = this.userService.getUser();
      this.element.querySelector('#userName')!.textContent = user.name;
    }
  }