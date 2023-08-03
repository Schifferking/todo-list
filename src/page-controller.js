import DOMCreator from './dom-creator.js';
import EventListenerAgregator from './event-listener-agregator.js';
import ProjectManager from './project-manager.js';
import TodoManager from './todo-manager.js';
import Project from './project.js';
import Todo from './todo.js';

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
    this.loadData();
    this.myELA.addNavbarListener(
      this.handleNavbarButtons, this.getNavBarArguments());
    this.myELA.addElementListener(
      this.myDCO.getElement('.projects-list'), this.handleProjectButtons);
    this.addTodoListListener();
  }

  createFC() {
    this.myFC = this.myDCO.formCreator;
  }

  // Move to another module (start)
  loadData() {
    if (this.isDataStored())
      this.loadObjects();
    this.handleDefaultProject();
  }

  isDataStored() {
    return localStorage.length >= 1;
  }

  loadObjects() {
    let objects = this.getData();
    let projects = this.getObjects(objects, '_name');
    let todos = this.getObjects(objects, 'title');
    this.loadProjects(projects, todos);
  }

  getData() {
    let objects = [];
    for (let key of Object.keys(localStorage)) {
      let object = this.createObject(JSON.parse(localStorage.getItem(key)));
      objects.push(object);
    }
    return objects;
  }

  createObject(objectParsed) {
    if (objectParsed['_name'])
      return new Project(objectParsed['_name']);
    else
      return new Todo(objectParsed);
  }

  getObjects(objects, propertyName) {
    return objects.filter(object => object.hasOwnProperty(propertyName));
  }

  loadProjects(projects, todos) {
    for (let project of projects) {
      this.loadTodos(project, todos);
      this.myPM.addProject(project);
      if (project.name !== 'default')
        this.myDCO.addProjectToSidebar(project.name);
    }
  }

  loadTodos(project, todos) {
    let projectTodos = this.getProjectTodos(project, todos);
    project.addTodos(projectTodos);
  }

  getProjectTodos(project, todos) {
    return todos.filter(todo => todo.project === project.name);
  }

  handleDefaultProject() {
    if (!localStorage.getItem('default')) {
      let defaultProject = new Project('default');
      this.myPM.addProject(defaultProject);
      defaultProject.save();
    }
    this.loadDefaultProject();
  }

  // Move to another module (end)
  loadDefaultProject() {
    this.myDCO.loadDefaultProject({pm: this.myPM});
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
             listenerFunction: this.addTodoListListener,
             actionFunction: this.myTM.addTodoToProject };
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
    else if (event.target.className === 'edit')
      this.editTodo(event.target.parentElement, projectObject);
  }

  getProjectObject() {
    let projectName = this.myDCO.getCurrentProjectName();
    return this.myPM.searchProject(projectName);    
  }

  handleTodo(element, projectObject) {
    let todoObject = this.getTodoObject(element, projectObject);
    if (this.myDCO.isTodoCollapsed(element))
      this.myDCO.expandTodo(element, todoObject);
    else
      this.myDCO.collapseTodo(element);
  }

  getTodoObject(element, projectObject) {
    let todoTitle = this.myDCO.obtainTodoTitle(element);
    return projectObject.searchTodo(todoTitle);
  }

  removeTodo(element, projectObject) {
    let todoObject = this.getTodoObject(element, projectObject);
    projectObject.removeTodo(todoObject);
    // make this line a method when adding mark complete logic
    this.myDCO.removeElement(element);
  }

  editTodo(liElement, projectObject) {
    let args = this.getEditTodoArgs(liElement, projectObject);
    this.myDCO.loadForm(this.myFC.createToDoForm);
    this.myELA.addFormListener(this.myTM.validateTodoForm, args);
  }

  getEditTodoArgs(liElement, projectObject) {
    return { dco: this.myDCO,
             pm: this.myPM,
             handleFunction: this.handleFormButtons,
             actionFunction: this.myTM.editTodo,
             todoObject: this.getTodoObject(liElement, projectObject) };
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
