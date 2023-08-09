import DOMCreator from "./dom-creator";
import EventListenerAgregator from "./event-listener-agregator";
import ProjectManager from "./project-manager";
import TodoManager from "./todo-manager";
import Project from "./project";
import Todo from "./todo";

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
      this.handleNavbarButtons,
      this.getNavBarArguments(),
    );
    this.myELA.addElementListener(
      this.myDCO.getElement(".projects-list"),
      this.handleProjectButtons,
    );
    this.addTodoListListener();
  }

  createFC() {
    this.myFC = this.myDCO.formCreator;
  }

  // Move to another module (start)
  loadData() {
    if (this.isDataStored()) this.loadObjects();
    this.handleDefaultProject();
  }

  isDataStored() {
    return localStorage.length >= 1;
  }

  loadObjects() {
    const objects = this.getData();
    const projects = this.getObjects(objects, "_name");
    const todos = this.getObjects(objects, "title");
    this.loadProjects(projects, todos);
  }

  getData() {
    const objects = [];
    Object.keys(localStorage).map(key => {
      const object = this.createObject(JSON.parse(localStorage.getItem(key)));
      objects.push(object);
      return objects});
    return objects;
  }

  createObject(objectParsed) {
    if (objectParsed._name) return new Project(objectParsed._name);
    return new Todo(objectParsed);
  }

  getObjects(objects, propertyName) {
    return objects.filter((object) => Object.prototype.hasOwnProperty.call(object, propertyName));
  }

  loadProjects(projects, todos) {
    projects.map(project => {
      this.loadTodos(project, todos);
      this.myPM.addProject(project);
      if (project.name !== 'default')
        this.myDCO.addProjectToSidebar(project.name);
      return this;
    });
  }

  loadTodos(project, todos) {
    const projectTodos = this.getProjectTodos(project, todos);
    project.addTodos(projectTodos);
  }

  getProjectTodos(project, todos) {
    return todos.filter((todo) => todo.project === project.name);
  }

  handleDefaultProject() {
    if (!localStorage.getItem("default")) {
      const defaultProject = new Project("default");
      this.myPM.addProject(defaultProject);
      defaultProject.save();
    }
    this.loadDefaultProject();
  }

  // Move to another module (end)
  loadDefaultProject() {
    this.myDCO.loadDefaultProject({ pm: this.myPM });
  }

  handleNavbarButtons = (event, args) => {
    const formName = this.myDCO.getAttributeFrom(event.target, "className");
    const formFunctions = this.selectFormFunctions(
      formName,
      args.validateFunctions,
    );
    this.myDCO.loadForm(formFunctions.formFunction);
    this.myELA.addFormListener(formFunctions.validateFunction, args);
  };

  selectFormFunctions(formName, functions) {
    switch (formName) {
      case "new-to-do":
        return {
          validateFunction: functions[0],
          formFunction: this.myFC.createToDoForm,
        };
      case "new-project":
        return {
          validateFunction: functions[1],
          formFunction: this.myFC.createProjectForm,
        };
        // no default
    }
  }

  getNavBarArguments() {
    return {
      dco: this.myDCO,
      pm: this.myPM,
      validateFunctions: this.getValidateFunctions(),
      handleFunction: this.handleFormButtons,
      listenerFunction: this.addTodoListListener,
      actionFunction: this.myTM.addTodoToProject,
    };
  }

  getValidateFunctions() {
    const functions = [
      this.myTM.validateTodoForm,
      this.myPM.handleProjectCreation,
    ];
    return functions;
  }

  handleFormButtons = (event, validateFunction, args) => {
    const buttonType = this.myDCO.getAttributeFrom(event.target, "type");
    if (buttonType === "button") this.myDCO.removeForm();
    if (buttonType === "submit") validateFunction(event, args);
  };

  addTodoListListener = () => {
    this.myELA.addElementListener(
      this.myDCO.getElement(".todo-list"),
      this.handleTodosLi,
    );
  };

  handleTodosLi = (event) => {
    const nodeName = this.myDCO.getAttributeFrom(event.target, "nodeName");
    const projectObject = this.getProjectObject();
    if (nodeName !== "BUTTON") this.handleTodo(event.target, projectObject);
    else if (event.target.className === "delete")
      this.removeTodo(this.getTodoLi(event.target), projectObject);
    else if (event.target.className === "edit")
      this.editTodo(this.getTodoLi(event.target), projectObject);
  };

  getProjectObject() {
    const projectName = this.myDCO.getCurrentProjectName();
    return this.myPM.searchProject(projectName);
  }

  handleTodo(element, projectObject) {
    const todoLi = this.getTodoLi(element);
    const todoObject = this.getTodoObject(todoLi, projectObject);
    if (this.myDCO.isTodoCollapsed(todoLi))
      this.myDCO.expandTodo(todoLi, todoObject);
    else this.myDCO.collapseTodo(todoLi);
  }

  getTodoObject(element, projectObject) {
    const todoTitle = this.myDCO.obtainTodoTitle(element);
    return projectObject.searchTodo(todoTitle);
  }

  getTodoLi(element) {
    if (element.classList.contains("todo-li")) return element;
    return this.getTodoLi(element.parentElement);
  }

  removeTodo(element, projectObject) {
    const todoObject = this.getTodoObject(element, projectObject);
    projectObject.removeTodo(todoObject);
    // make this line a method when adding mark complete logic
    this.myDCO.removeElement(element);
  }

  editTodo(liElement, projectObject) {
    const args = this.getEditTodoArgs(liElement, projectObject);
    this.myDCO.loadForm(this.myFC.createToDoForm);
    this.myELA.addFormListener(this.myTM.validateTodoForm, args);
  }

  getEditTodoArgs(liElement, projectObject) {
    return {
      dco: this.myDCO,
      pm: this.myPM,
      handleFunction: this.handleFormButtons,
      actionFunction: this.myTM.editTodo,
      todoObject: this.getTodoObject(liElement, projectObject),
    };
  }

  handleProjectButtons = (event) => {
    const className = this.myDCO.getAttributeFrom(event.target, "className");
    if (className === "project-button") {
      const projectName = this.myDCO.getAttributeFrom(event.target, "innerText");
      this.myDCO.replaceProjectContainer(projectName, { pm: this.myPM });
      this.addTodoListListener();
    }
  };
}
