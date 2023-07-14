import FormCreator from "./form-creator.js";

export default class DOMCreator {
  constructor(formCreatorObject=FormCreator) {
    this.script = document.querySelector('script');
    this.formCreator = new formCreatorObject();
  }

  get script() {
    return this._script;
  }

  set script(value) {
    this._script = value;
  }

  get formCreator() {
    return this._formCreator;
  }

  set formCreator(value) {
    this._formCreator = value;
  }

  loadPage() {
    this.createHeader();
    this.createSidebar();
    this.createMain();
    this.createFooter();
  }

  createHeader() {
    let header = document.createElement('header');
    let nav = document.createElement('nav');
    let navbar = this.createNavbar();
    header.appendChild(nav);
    nav.appendChild(navbar);
    this.script.parentNode.insertBefore(header, this.script);
  }

  createNavbar() {
    // Consider adding more elements
    let ul = this.createUl('navbar');
    let todoButton = this.createButton('New to-do', {className: 'new-to-do'});
    let projectButton = this.createButton('New project',
      {className: 'new-project'});
    let listElements = [todoButton, projectButton];
    this.appendListElements(ul, listElements);
    return ul;
  }

  createUl(className='') {
    const ul = document.createElement('ul');
    if (className)
      ul.classList.add(className);
    return ul;
  }

  appendListElements(list, elements) {
    for (let element of elements)
      list.appendChild(element);
  }

  loadForm = (createFormFunction) => {
    if (this.getElement('form') === null) {
      let main = this.getElement('main');
      const cancelButton = this.createButton('Cancel', {type: 'button'});
      const form = createFormFunction(cancelButton);
      main.appendChild(form);
    }
  }

  getElement(query) {
    return document.querySelector(query);
  }

  createButton(content, args={}) {
    let newButton = document.createElement('button');
    newButton.textContent = content;
    if (args['type'])
      newButton.setAttribute('type', args['type']);
    if (args['className'])
      newButton.classList.add(args['className']);
    return newButton;
  }

  removeForm() {
    const form = this.getElement('form');
    this.removeElement(form);
  }

  removeElement(element) {
    element.remove();
  }

  addProjectToSidebar(projectName) {
    let projectsList = this.getElement('.projects-list');
    const newProject = this.createButton(
      projectName, { className: 'project-button' });
    projectsList.appendChild(this.createLi(newProject));
  }

  createHeading(content, heading) {
    let headingElement = document.createElement(heading);
    headingElement.textContent = content;
    return headingElement;
  }

  createLi(element) {
    let li = document.createElement('li');
    li.appendChild(element);
    return li;
  }

  createSidebar() {
    let nav = document.createElement('nav');
    const projectsH1 = this.createHeading('Projects', 'h1');
    let projectsList = this.createProjectsList();
    let listElements = [projectsH1, projectsList];
    this.appendListElements(nav, listElements);
    this.script.parentNode.insertBefore(nav, this.script);
  }

  createProjectsList() {
    let projectsList = this.createUl('projects-list');
    let defaultButton = this.createButton(
      'default', { className: 'project-button' });
    projectsList.appendChild(this.createLi(defaultButton));
    return projectsList;
  }

  createMain() {
    const main = document.createElement('main');
    let content = this.createDiv('content');
    const defaultContainer = this.createProjectContainer('default-container')
    content.appendChild(defaultContainer);
    main.appendChild(content);
    this.script.parentNode.insertBefore(main, this.script);
  }

  createProjectContainer(projectClassName, args={}) {
    // Consider a method in another module to change this line
    let projectName = projectClassName.replace('-container', '');
    let projectContainer = this.createDiv(projectClassName);
    let projectHeading = this.createHeading(projectName, 'h1');
    let todoList = this.loadTodos(projectName, args);
    this.appendListElements(projectContainer, [projectHeading, todoList]);
    return projectContainer;
  }

  createDiv(className) {
    let div = document.createElement('div');
    div.classList.add(className);
    return div;
  }
  
  loadTodos(projectName, args) {
    let todoList = this.createUl('todo-list');
    if (args['pm']) {
      let projectObject = args['pm'].searchProject(projectName);
      let todos = this.createTodos(projectObject.todos);
      this.appendListElements(todoList, todos);
    }
    return todoList;
  }

  createTodos(todos) {
    let liTodos = [];
    for (let todo of todos)
      liTodos.push(this.createTodo(todo.title, todo.description));
    return liTodos;
  }

  createFooter() {
    const footer = document.createElement('footer');
    this.script.parentNode.insertBefore(footer, this.script);
  }

  loadProject(formData) {
    this.replaceProjectContainer(`${formData}-container`);
    this.addProjectToSidebar(formData);
    this.removeForm();
  }

  removeProjectContainer() {
    const projectContainer = this.getCurrentProjectContainer();
    this.removeElement(projectContainer);
  }

  getCurrentProjectContainer() {
    return this.getElement('.content > div');
  }

  replaceProjectContainer(projectClassName, args={}) {
    let content = this.getElement('.content');
    let newProjectContainer = this.createProjectContainer(
      projectClassName, args);
    this.removeProjectContainer();
    content.appendChild(newProjectContainer);
  }

  getCurrentProjectName() {
    const projectContainer = this.getCurrentProjectContainer();
    let projectClassName = projectContainer.className;
    return projectClassName.split('-')[0];
  }

  createTodo(title, description) {
    let createButton = this.createButton('Mark complete');
    let deleteButton = this.createButton('Delete', {className: 'delete'});
    let todoInfo = this.createParagraph(
      `Title: ${title}, Description: ${description}`);
    let li = this.createLi(createButton);
    this.appendListElements(li, [deleteButton, todoInfo]);
    return li;
  }

  createParagraph(content) {
    let paragraph = document.createElement('p');
    paragraph.textContent = content;
    return paragraph;
  }

  loadTodo(todo) {
    let todoList = this.getElement('.todo-list');
    todoList.appendChild(todo);
  }

  obtainTodoTitle(liElement) {
    let todoInfo = liElement.querySelector('p');
    let todoTitle = todoInfo.textContent.split(',');
    todoTitle = todoTitle[0].split(': ');
    return todoTitle[1];
  }

  updateTodo(todoElement, todoData) {
    let p = this.createParagraph(
      `Due date: ${todoData['dueDate']}, priority: ${todoData['priority']}`);
    todoElement.appendChild(p);
  }

  getAttributeFrom(element, attribute) {
    return element[attribute];
  }
}
