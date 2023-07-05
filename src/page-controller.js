import DOMCreator from './dom-creator.js';
import EventListenerAgregator from './event-listener-agregator.js';
import ProjectManager from './project-manager.js';

export default class PageController {
  constructor() {
    this.myDOMCreator = new DOMCreator();
    this.myEventListenerAgregator = new EventListenerAgregator();
    this.myProjectManager = new ProjectManager();
  }

  loadPage() {
    // Add validateToDoForm to test it
    this.myDOMCreator.loadPage();
    this.myEventListenerAgregator.addNavbarListener(this.myDOMCreator,
      [this.myProjectManager.validateProjectForm]);
  }
}
