import FormCreator from "./form-creator.js";

export default class DOMCreator {
  constructor(formCreatorObject=FormCreator) {
    this.script = document.querySelector('script');
    this.formCreator = new formCreatorObject();
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
    if (document.querySelector('form') === null) {
      let main = document.querySelector('main');
      const cancelButton = this.createButton('Cancel', {type: 'button'});
      const form = createFormFunction(cancelButton);
      main.appendChild(form);
    }
  }

  createButton(content, args) {
    let newButton = document.createElement('button');
    newButton.textContent = content;
    if (args['type'])
      newButton.setAttribute('type', args['type']);
    if (args['className'])
      newButton.classList.add(args['className']);
    return newButton;
  }

  removeForm() {
    const form = document.querySelector('form');
    form.remove();
  }

  addProjectToSidebar(projectName) {
    let projectsList = document.querySelector('.projects-list');
    const newProject = this.createHeading(projectName, 'h2');
    projectsList.appendChild(this.createLi(newProject));
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

  createHeading(content, heading) {
    let headingElement = document.createElement(heading);
    headingElement.textContent = content;
    return headingElement;
  }

  createProjectsList() {
    let projectsList = this.createUl('projects-list');
    const defaultH2 = this.createHeading('default', 'h2');
    projectsList.appendChild(this.createLi(defaultH2));
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

  createProjectContainer(projectClassName) {
    let projectContainer = this.createDiv(projectClassName);
    let todoList = this.createUl('todo-list');
    projectContainer.appendChild(todoList);
    return projectContainer;
  }

  createDiv(className) {
    let div = document.createElement('div');
    div.classList.add(className);
    return div;
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
    const projectContainer = document.querySelector('.content > div');
    projectContainer.remove();
  }

  replaceProjectContainer(projectClassName) {
    let content = document.querySelector('.content');
    let newProjectContainer = this.createProjectContainer(projectClassName);
    this.removeProjectContainer();
    content.appendChild(newProjectContainer);
  }

  getCurrentProjectName() {
    const projectContainer = document.querySelector('.content > div');
    let projectClassName = projectContainer.className;
    return projectClassName.split('-')[0];
  }
}
