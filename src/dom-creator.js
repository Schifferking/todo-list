import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import FormCreator from "./form-creator";

export default class DOMCreator {
  constructor(FormCreatorObject = FormCreator) {
    this.script = document.querySelector("script");
    this.formCreator = new FormCreatorObject();
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
    const header = document.createElement("header");
    const nav = document.createElement("nav");
    const navbar = this.createNavbar();
    header.appendChild(nav);
    nav.appendChild(navbar);
    this.script.parentNode.insertBefore(header, this.script);
  }

  createNavbar() {
    // Consider adding more elements
    const ul = this.createUl("navbar");
    const todoButton = this.createButton("", { className: "new-to-do" });
    const projectButton = this.createButton("", { className: "new-project" });
    const listElements = [todoButton, projectButton];
    this.appendListElements(ul, listElements);
    return ul;
  }

  createUl(className = "") {
    const ul = document.createElement("ul");
    if (className) ul.classList.add(className);
    return ul;
  }

  appendListElements(list, elements) {
    elements.map(element => list.appendChild(element));
  }

  loadForm = (createFormFunction) => {
    if (this.getElement("form") === null) {
      const todoList = this.getElement(".todo-list");
      const cancelButton = this.createButton("Cancel", { type: "button" });
      const form = createFormFunction(cancelButton);
      todoList.parentNode.insertBefore(form, todoList);
    }
  };

  getElement(query, element = "") {
    if (element) return element.querySelector(query);
    return document.querySelector(query);
  }

  createButton(content, args = {}) {
    const newButton = document.createElement("button");
    newButton.textContent = content;
    if (args.type) newButton.setAttribute("type", args.type);
    if (args.className) newButton.classList.add(args.className);
    return newButton;
  }

  removeForm() {
    const form = this.getElement("form");
    this.removeElement(form);
  }

  removeElement(element) {
    element.remove();
  }

  addProjectToSidebar(projectName) {
    const projectsList = this.getElement(".projects-list");
    const newProject = this.createButton(projectName, {
      className: "project-button",
    });
    projectsList.appendChild(this.createLi(newProject));
  }

  createHeading(content, heading) {
    const headingElement = document.createElement(heading);
    headingElement.textContent = content;
    return headingElement;
  }

  createLi(element, className = "") {
    const li = document.createElement("li");
    li.appendChild(element);
    if (className) li.classList.add(className);
    return li;
  }

  createSidebar() {
    const nav = document.createElement("nav");
    nav.classList.add("sidebar");
    const projectsH1 = this.createHeading("Projects", "h1");
    const projectsList = this.createProjectsList();
    const listElements = [projectsH1, projectsList];
    this.appendListElements(nav, listElements);
    this.script.parentNode.insertBefore(nav, this.script);
  }

  createProjectsList() {
    const projectsList = this.createUl("projects-list");
    return projectsList;
  }

  createMain() {
    const main = document.createElement("main");
    const content = this.createDiv("content");
    main.appendChild(content);
    this.script.parentNode.insertBefore(main, this.script);
  }

  createProjectContainer(projectClassName, args = {}) {
    // Consider a method in another module to change this line
    const projectName = projectClassName.replace("-container", "");
    const projectContainer = this.createDiv(projectClassName);
    const projectHeading = this.createHeading(projectName, "h1");
    const todoList = this.loadTodos(projectName, args);
    this.appendListElements(projectContainer, [projectHeading, todoList]);
    return projectContainer;
  }

  createDiv(className) {
    const div = document.createElement("div");
    div.classList.add(className);
    return div;
  }

  loadTodos(projectName, args) {
    const todoList = this.createUl("todo-list");
    if (args.pm) {
      const projectObject = args.pm.searchProject(projectName);
      const todos = this.createTodos(projectObject._todos);
      this.appendListElements(todoList, todos);
    }
    return todoList;
  }

  createTodos(todos) {
    const liTodos = [];
    todos.map(todo => liTodos.push(this.createTodo(todo.title, todo.dueDate)));
    return liTodos;
  }

  createFooter() {
    const footer = document.createElement("footer");
    this.script.parentNode.insertBefore(footer, this.script);
  }

  loadDefaultProject(args) {
    const defaultContainer = this.createProjectContainer(
      "default-container",
      args,
    );
    const projectsList = this.getElement(".projects-list");
    const defaultButton = this.createButton("default", {
      className: "project-button",
    });
    this.loadProjectContainer(defaultContainer);
    projectsList.appendChild(this.createLi(defaultButton));
  }

  loadProjectContainer(projectContainer) {
    const content = this.getElement(".content");
    content.appendChild(projectContainer);
  }

  loadProject(formData) {
    this.replaceProjectContainer(`${formData}-container`);
    this.addProjectToSidebar(formData);
  }

  removeProjectContainer() {
    const projectContainer = this.getCurrentProjectContainer();
    this.removeElement(projectContainer);
  }

  getCurrentProjectContainer() {
    return this.getElement(".content > div");
  }

  replaceProjectContainer(projectClassName, args = {}) {
    const content = this.getElement(".content");
    const newProjectContainer = this.createProjectContainer(
      projectClassName,
      args,
    );
    this.removeProjectContainer();
    content.appendChild(newProjectContainer);
  }

  getCurrentProjectName() {
    const projectContainer = this.getCurrentProjectContainer();
    const projectClassName = projectContainer.className;
    return projectClassName.split("-")[0];
  }

  createTodo(title, dueDate) {
    const dateFormatted = this.formatDate(dueDate);
    const buttonsContainer = this.createDiv("form-buttons-container");
    const createButton = this.createButton("", { className: "edit" });
    const deleteButton = this.createButton("", { className: "delete" });
    this.appendListElements(buttonsContainer, [createButton, deleteButton]);
    const todoInfo = this.createParagraph(
      `Title: ${title}, Due date: ${dateFormatted}`,
    );
    const li = this.createLi(buttonsContainer, "todo-li");
    li.appendChild(todoInfo);
    return li;
  }

  formatDate(date) {
    const dateFormat = "MM/dd/yyyy HH:mm a";
    const dateParsed = parseISO(date);
    return format(dateParsed, dateFormat);
  }

  createParagraph(content) {
    const paragraph = document.createElement("p");
    paragraph.textContent = content;
    return paragraph;
  }

  loadTodo(todo) {
    const todoList = this.getElement(".todo-list");
    todoList.appendChild(todo);
  }

  obtainTodoTitle(liElement) {
    const todoInfo = liElement.querySelector("p");
    let todoTitle = todoInfo.textContent.split(",");
    todoTitle = todoTitle[0].split(": ");
    return todoTitle[1];
  }

  updateTodo(todoElement, todoData) {
    const p = this.createParagraph(
      `Description: ${todoData.description},
       priority: ${todoData.priority}`,
    );
    todoElement.appendChild(p);
  }

  getAttributeFrom(element, attribute) {
    return element[attribute];
  }

  getElements(query, element = "") {
    if (element) return Array.from(element.querySelectorAll(query));
    return Array.from(document.querySelectorAll(query));
  }

  getTodoParagraph(title) {
    const todoParagraphs = this.getElements(".todo-list > li > p:first-of-type");
    return todoParagraphs.find((p) =>
      p.textContent.includes(`Title: ${title}`),
    );
  }

  updateTodoLi(paragraph, todoObject) {
    const paragraphCopy = paragraph;
    paragraphCopy.textContent = `Title: ${todoObject.title},
                             due date: ${this.formatDate(todoObject.dueDate)}`;
  }

  getTodoParagraphsList(todoLi) {
    return this.getElements("p", todoLi);
  }

  isTodoCollapsed(todoLi) {
    const todoParagraphs = this.getTodoParagraphsList(todoLi);
    return todoParagraphs.length <= 1;
  }

  expandTodo(element, todoObject) {
    const todoRemainingData = {
      description: todoObject.description,
      priority: todoObject.priority,
    };
    this.updateTodo(element, todoRemainingData);
    // add something later to mark the todo as complete (think about adding
    //   a new completed property in todo object)
  }

  collapseTodo(element) {
    const lastParagraph = element.lastChild;
    this.removeElement(lastParagraph);
  }
}
