import FormCreator from "./form-creator.js";

export default class DOMCreator {
  script = document.querySelector('script');
  formCreator = new FormCreator();

  loadPage() {
    this.createHeader();
    // this.createSidebar();
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
    // consider adding more elements
    let ul = this.createUl();
    ul.addEventListener('click', this.handleNavbarButtons);
    let todoButton = this.createButton('New to-do', undefined, 'new-to-do');
    let projectButton = this.createButton('New project', undefined, 'new-project');
    ul.appendChild(this.createLi(todoButton));
    ul.appendChild(this.createLi(projectButton));
    return ul;
  }

  createUl() {
    const ul = document.createElement('ul');
    return ul;
  }

  handleNavbarButtons = (event) => {
    if (event.target.className === 'new-to-do')
      this.loadForm(this.formCreator.createToDoForm, this.validateToDoForm);
    if (event.target.className === 'new-project')
      this.loadForm(this.formCreator.createProjectForm, this.validateProjectForm);
  }

  loadForm = (createFormFunction, validateFormFunction) => {
    if (document.querySelector('form') === null) {
      let main = document.querySelector('main');
      const cancelButton = this.createButton('Cancel', 'button');
      const form = createFormFunction(cancelButton);
      form.addEventListener('click', (event) => {
        this.handleFormButtons(event, validateFormFunction);
      });
      main.appendChild(form);
    }
  }

  createButton(content, type='', className='') {
    let newButton = document.createElement('button');
    newButton.textContent = content;
    if (type === 'button')
      newButton.setAttribute('type', type);
    if (className)
      newButton.classList.add(className);
    return newButton;
  }

  handleFormButtons = (event, validateFunction) => {
    // Cancel button 
    if (event.target.type === 'button')
      this.removeForm();
    // Submit button
    if (event.target.type === 'submit')
      validateFunction(event);
  }

  removeForm() {
    const form = document.querySelector('form');
    form.remove();
  }

  validateToDoForm = (event) => {
    const formData = this.gatherToDoFormData(event);
    if (formData.includes(''))
      // Add something to notify error to user (maybe put it in todo.js)
      return;
    this.removeForm();
  }

  gatherToDoFormData(event) {
    event.preventDefault();
    const todoTitle = document.querySelector("[name='todo-title']").value;
    const todoDescription = document.querySelector("[name='todo-description']").value;
    const todoDueDate = document.querySelector("[name='todo-dueDate']").value;
    const todoPriority = document.querySelector("[name='todo-priority']").value;
    return [todoTitle, todoDescription, todoDueDate, todoPriority];
  }

  validateProjectForm = (event) => {
    const formData = this.gatherProjectFormData(event);
    if (formData === '')
      // Add something to notify error to user (maybe put it in todo.js)
      return;
    this.removeForm();
  }

  gatherProjectFormData(event) {
    event.preventDefault();
    const projectName = document.querySelector("[name='project-name']").value;
    return projectName;
  }

  createLi(element) {
    let li = document.createElement('li');
    li.appendChild(element);
    return li;
  }

  createMain() {
    const main = document.createElement('main');
    this.script.parentNode.insertBefore(main, this.script);
  }

  createFooter() {
    const footer = document.createElement('footer');
    this.script.parentNode.insertBefore(footer, this.script);
  }

  createSidebar() {
    let nav = document.createElement('nav');
    const projectsH1 = this.createH1('Projects');
    const defaultH2 = this.createH2('Default');
    nav.appendChild(projectsH1);
    nav.appendChild(defaultH2);
    this.script.parentNode.insertBefore(nav, this.script);
  }

  createH1(content) {
    let h1 = document.createElement('h1');
    h1.textContent = content;
    return h1;
  }

  createH2(content) {
    let h2 = document.createElement('h2');
    h2.textContent = content;
    return h2;
  }
}
