export default class EventListenerAgregator {
  // dco means DOMCreatorObject

  addNavbarListener(dco, validateFunctions) {
    let navbar = document.querySelector('.navbar');
    navbar.addEventListener('click',
      (event) => this.handleNavbarButtons(event, dco, validateFunctions));
  }

  handleNavbarButtons = (event, dco, validateFunctions) => {
    let buttonClassName = this.getAttributeFrom(event.target, 'className');
    let formFunction = this.getFormFunction(dco.formCreator, buttonClassName);
    if (buttonClassName === 'new-to-do') {
      dco.loadForm(formFunction);
      this.addFormListener(this.validateToDoForm, dco);
    }
    if (buttonClassName === 'new-project') {
      dco.loadForm(formFunction);
      this.addFormListener(validateFunctions[0], dco);
    }
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

  addFormListener(validateFunction, dco) {
    let form = document.querySelector('form');
    form.addEventListener('click',
      (event) => this.handleFormButtons(event, validateFunction, dco));
  }

  handleFormButtons = (event, validateFunction, dco) => {
    let buttonType = this.getAttributeFrom(event.target, 'type');
    if (buttonType === 'button')
      dco.removeForm();
    if (buttonType === 'submit')
      validateFunction(event, dco);
  }

  validateToDoForm = (event, dco) => {
    const formData = this.gatherToDoFormData(event);
    if (formData.includes('')) {
      // Add something to notify error to user (maybe use a modal)
      console.log("Couldn't create To-do");
      return;
    }
    // Create To-do object
    // Add to-do to project object
    // Create li with to-do information
    dco.removeForm();
  }

  gatherToDoFormData = (event) => {
    event.preventDefault();
    const todoTitle = this.getAttributeFrom(
        document.querySelector("[name='todo-title']"), 'value');
    const todoDescription = this.getAttributeFrom(
      document.querySelector("[name='todo-description']"), 'value');
    const todoDueDate = this.getAttributeFrom(
      document.querySelector("[name='todo-dueDate']"), 'value');
    const todoPriority = this.getAttributeFrom(
      document.querySelector("[name='todo-priority']"), 'value');
    // Consider returning an object instead
    return [todoTitle, todoDescription, todoDueDate, todoPriority];
  }
}
