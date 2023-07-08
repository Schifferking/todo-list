import DOMCreator from './dom-creator.js';
import EventListenerAgregator from './event-listener-agregator.js';
import ProjectManager from './project-manager.js';
import TodoManager from './todo-manager.js';

export default class PageController {
  constructor() {
    this.myDCO = new DOMCreator();
    this.myELA = new EventListenerAgregator();
    this.myPM = new ProjectManager();
    this.myTM = new TodoManager();
  }

  loadPage() {
    this.myDCO.loadPage();
    this.myELA.addNavbarListener(this.getNavBarArguments());
    this.myELA.addProjectsListListener({ dco: this.myDCO, pm: this.myPM });
  }

  getNavBarArguments() {
    return { dco: this.myDCO,
             pm: this.myPM,
             validateFunctions: this.getValidateFunctions() };
  }

  getValidateFunctions() {
    let functions = [this.myTM.validateTodoForm, this.myPM.validateProjectForm];
    return functions;
  }
}
