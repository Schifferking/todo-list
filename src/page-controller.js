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
    this.addTodoListListener();
  }

  createFC() {
    this.myFC = this.myDCO.formCreator;
  }

  handleNavbarButtons = (event, args) => {
    let formName = this.myDCO.getAttributeFrom(
      event.target, 'className');
    let formFunctions = this.selectFormFunctions(
      formName, args['validateFunctions']);
    this.myDCO.loadForm(formFunctions['formFunction']);
    this.myELA.addFormListener(formFunctions['validateFunction'], args);
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

  getNavBarArguments() {
    return { dco: this.myDCO,
             pm: this.myPM,
             validateFunctions: this.getValidateFunctions(),
             handleFunction: this.handleFormButtons,
             listenerFunction: this.addTodoListListener };
  }

  getValidateFunctions() {
    let functions = [this.myTM.validateTodoForm,
                     this.myPM.handleProjectCreation];
    return functions;
  }

  handleFormButtons = (event, validateFunction, args) => {
    let buttonType = this.myDCO.getAttributeFrom(event.target, 'type');
    if (buttonType === 'button')
      this.myDCO.removeForm();
    if (buttonType === 'submit')
      validateFunction(event, args);
  }

  addTodoListListener = () => {
    this.myELA.addElementListener(
      this.myDCO.getElement('.todo-list'), this.handleTodosLi);
  }

  handleTodosLi = (event) => {
    let nodeName = this.myDCO.getAttributeFrom(event.target, 'nodeName');
    let projectObject = this.getProjectObject();
    if (nodeName !== 'BUTTON')
      this.handleTodo(event.target, projectObject);
    else if (event.target.className === 'delete')
      this.removeTodo(event.target.parentElement, projectObject);
  }

  getProjectObject() {
    let projectName = this.myDCO.getCurrentProjectName();
    return this.myPM.searchProject(projectName);    
  }

  handleTodo(element, projectObject) {
    let todoObject = this.getTodoObject(element, projectObject);
    let todoChildren = element.children.length;
    if (todoChildren == 3)
      this.expandTodo(element, todoObject);
    else if (todoChildren > 3)
      this.collapseTodo(element);
  }

  getTodoObject(element, projectObject) {
    let todoTitle = this.myDCO.obtainTodoTitle(element);
    return projectObject.searchTodo(todoTitle);
  }

  expandTodo(element, todoObject) {
    let todoRemainingData = {
      description: todoObject.description,
      priority: todoObject.priority};
    // maybe add a button that allows to edit the todo.
    this.myDCO.updateTodo(element, todoRemainingData);
    // add something later to mark the todo as complete (think about adding
    //   a new completed property in todo object)
  }

  collapseTodo(element) {
    let lastParagraph = element.lastChild;
    this.myDCO.removeElement(lastParagraph);
  }

  removeTodo(element, projectObject) {
    let todoObject = this.getTodoObject(element, projectObject);
    projectObject.removeTodo(todoObject);
    // make this line a method when adding mark complete logic
    this.myDCO.removeElement(element);
  }

  handleProjectButtons = (event) => {
    let className = this.myDCO.getAttributeFrom(event.target, 'className');
    if (className === 'project-button') {
      let projectName = this.myDCO.getAttributeFrom(event.target, 'innerText');
      this.myDCO.replaceProjectContainer(projectName, { pm: this.myPM });
      this.addTodoListListener();
    }
  }
}
