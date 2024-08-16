import { Injectable } from "/framework/ioc";

@Injectable()
export class UserService {
    getUser() {
      return { name: 'John Doe' };
    }
  }