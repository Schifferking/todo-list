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
    let todoButton = this.createButton('New to-do');
    todoButton.addEventListener('click', this.loadForm);
    ul.appendChild(this.createLi(todoButton));
    return ul;
  }

  createUl() {
    const ul = document.createElement('ul');
    return ul;
  }

  loadForm = () => {
    if (document.querySelector('form') === null) {
      let main = document.querySelector('main');
      const cancelButton = this.createButton('Cancel', 'button');
      const form = this.formCreator.createToDoForm(cancelButton);
      main.appendChild(form);
    }
  }

  createLi(element) {
    let li = document.createElement('li');
    li.appendChild(element);
    return li;
  }

  createButton(content, type='') {
    let newButton = document.createElement('button');
    newButton.textContent = content;
    if (type === 'button')
      newButton.setAttribute('type', type);
    return newButton;
  }

  removeForm = () => {
    let form = document.querySelector('form');
    form.remove();
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

  createMain() {
    const main = document.createElement('main');
    this.script.parentNode.insertBefore(main, this.script);
  }

  createFooter() {
    const footer = document.createElement('footer');
    this.script.parentNode.insertBefore(footer, this.script);
  }
}
