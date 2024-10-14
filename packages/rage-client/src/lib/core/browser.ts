export class Browser {
  private instance: BrowserMp;

  private constructor() {
    mp.gui.chat.show(false);

    this.instance = mp.browsers.new('http://localhost:4200');
    this.instance.active = true;

    this.instance.markAsChat();
  }

  call(type: 'native', eventName: string, ...args: any[]) {
    switch (type) {
      case 'native':
        this.instance.call(eventName, ...args);
        break;
      default:
        break;
    }
  }

  showInterface(interfaceKey: string) {


  }

  hideInterface(interfaceKey: string) {

  }

  static initialize() {
    return new Browser();
  }
}
