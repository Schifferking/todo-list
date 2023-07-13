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
    this.createFC();
    this.myDCO.loadPage();
    this.myELA.addNavbarListener(
      this.handleNavbarButtons, this.getNavBarArguments());
    this.myELA.addElementListener(
      this.myDCO.getElement('.projects-list'), this.handleProjectButtons);
    this.myELA.addElementListener(this.myDCO.getElement('.todo-list'), this.handleTodosLi);
  }

  getNavBarArguments() {
    return { dco: this.myDCO,
             pm: this.myPM,
             validateFunctions: this.getValidateFunctions(),
             handleFunction: this.handleFormButtons };
  }

  getValidateFunctions() {
    let functions = [this.myTM.validateTodoForm, this.myPM.validateProjectForm];
    return functions;
  }

  handleNavbarButtons = (event, args) => {
    let formName = this.myDCO.getAttributeFrom(
      event.target, 'className');
    let formFunctions = this.selectFormFunctions(
      formName, args['validateFunctions']);
    this.myDCO.loadForm(formFunctions['formFunction']);
    this.myELA.addFormListener(formFunctions['validateFunction'], args);
  }

  createFC() {
    this.myFC = this.myDCO.formCreator;
  }

  selectFormFunctions(formName, functions) {
    switch(formName) {
      case 'new-to-do':
        return { validateFunction: functions[0],
                 formFunction: this.myFC.createToDoForm };
      case 'new-project':
        return { validateFunction: functions[1],
                 formFunction: this.myFC.createProjectForm };
    }
  }

  handleFormButtons = (event, validateFunction, args) => {
    let buttonType = this.myDCO.getAttributeFrom(event.target, 'type');
    if (buttonType === 'button')
      this.myDCO.removeForm();
    if (buttonType === 'submit')
      validateFunction(event, args);
  }

  handleProjectButtons = (event) => {
    let className = this.myDCO.getAttributeFrom(event.target, 'className');
    if (className === 'project-button') {
      let projectName = this.myDCO.getAttributeFrom(event.target, 'innerText');
      this.myDCO.replaceProjectContainer(projectName, { pm: this.myPM });
      this.myELA.addElementListener(
        this.myDCO.getElement('.todo-list'), this.handleTodosLi);
    }
  }

  handleTodosLi = (event) => {
    let nodeName = this.myDCO.getAttributeFrom(event.target, 'nodeName');
    if (nodeName !== 'BUTTON') {
      let todoChildren = event.target.children.length;
      if (todoChildren == 2)
        this.expandTodo(event);
      else if (todoChildren > 2)
        this.collapseTodo(event.target);
    }
  }

  expandTodo(event) {
    let projectName = this.myDCO.getCurrentProjectName();
    let projectObject = this.myPM.searchProject(projectName);
    let todoTitle = this.myDCO.obtainTodoTitle(event.target);
    let todoObject = projectObject.searchTodo(todoTitle);
    let todoRemainingData = {
      dueDate: todoObject.dueDate, priority: todoObject.priority};
    // maybe add a button that allows to edit the todo.
    this.myDCO.updateTodo(event.target, todoRemainingData);
    // add something later to mark the todo as complete (think about adding
    //   a new completed property in todo object)
  }

  collapseTodo(element) {
    let lastParagraph = element.lastChild;
    this.myDCO.removeElement(lastParagraph);
  }
}
