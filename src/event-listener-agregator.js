export default class EventListenerAgregator {
  // dco means DOMCreatorObject

  addNavbarListener(args) {
    let navbar = document.querySelector('.navbar');
    navbar.addEventListener('click',
      (event) => this.handleNavbarButtons(event, args));
  }

  handleNavbarButtons = (event, args) => {
    let dco = this.obtainDCO(args);
    let validateFunctions = args['validateFunctions'];
    let buttonClassName = this.getAttributeFrom(event.target, 'className');
    let formFunction = this.getFormFunction(
      this.getFormCreator(dco), buttonClassName);
    if (buttonClassName === 'new-to-do') {
      dco.loadForm(formFunction);
      this.addFormListener(validateFunctions[0], args);
    }
    if (buttonClassName === 'new-project') {
      dco.loadForm(formFunction);
      this.addFormListener(validateFunctions[1], args);
    }
  }

  obtainDCO(args) {
    return args['dco'];
  }

  getAttributeFrom(element, attribute) {
    return element[attribute];
  }

  getFormFunction(formCreator, form) {
    if (form === 'new-to-do')
      return formCreator.createToDoForm;
    if (form === 'new-project')
      return formCreator.createProjectForm;
  }

  getFormCreator(dco) {
    return dco.formCreator;
  }

  addFormListener(validateFunction, args) {
    let form = document.querySelector('form');
    form.addEventListener('click',
      (event) => this.handleFormButtons(event, validateFunction, args));
  }

  handleFormButtons = (event, validateFunction, args) => {
    let dco = this.obtainDCO(args);
    let buttonType = this.getAttributeFrom(event.target, 'type');
    if (buttonType === 'button')
      dco.removeForm();
    if (buttonType === 'submit')
      validateFunction(event, args);
  }

  addProjectsListListener(args={}) {
    let projectsList = document.querySelector('.projects-list');
    projectsList.addEventListener('click', (event) =>
      this.handleProjectButtons(event, args));
  }

  handleProjectButtons(event, args) {
    let className = this.getAttributeFrom(event.target, 'className');
    if (className === 'project-button') {
      let projectName = this.getAttributeFrom(event.target, 'innerText');
      args['dco'].replaceProjectContainer(projectName, { pm: args['pm'] });
    }
  }
}
