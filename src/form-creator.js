import Todo from "./todo.js";

export default class FormCreator {
  createToDoForm(button) {
    const labels = this.createLabels();
    const inputs = this.createInputs();
    const elements = this.appendInputs(labels, inputs);
    elements.push(button);
    return this.appendFormElements(elements);
  }

  createLabels() {
    const labelContents = ['*Title:', '*Description:', '*Due Date:', '*Priority:'];
    let labels = [];
    for (const content of labelContents)
      labels.push(this.createLabel(content));
    return labels;
  }

  createLabel(content) {
    const label = document.createElement('label');
    label.textContent = content;
    return label;
  }

  createInputs() {
    const textInputs = this.createTextInputs();
    const distinctInputs = this.createDistinctInputs();
    return textInputs.concat(distinctInputs);
  }

  createTextInputs() {
    let inputs = [];
    const inputNames = ['todo-title', 'todo-description'];
    for (const name of inputNames)
      inputs.push(this.createInput(name));
    return inputs;
  }

  createDistinctInputs() {
    const datePicker = this.createDatetimeLocalInput('todo-dueDate');
    const numberInput = this.createNumberInput('todo-priority');
    return [datePicker, numberInput];
  }

  createInput(name, type='') {
    const input = document.createElement('input');
    input.setAttribute('name', name);
    input.setAttribute('required', '');
    if (type)
      input.setAttribute('type', type);
    return input;
  }

  createNumberInput(name) {
    // For the moment it's only used for a priority input
    const input = this.createInput(name, 'number');
    input.setAttribute('min', '1');
    input.setAttribute('max', '3');
    input.setAttribute('placeholder', '1');
    return input;
  }

  createDatetimeLocalInput(name) {
    const input = this.createInput(name, 'datetime-local');
    input.setAttribute('value', this.getCurrentDate());
    return input;
  }

  getCurrentDate() {
    // Returns date in the format yyyy-MM-DD-Thh:mm
    return new Date().toJSON().slice(0,19);
  }

  appendInputs(labels, inputs) {
    let labelsDeepCopy = this.deepCloneNodes(labels);
    const inputsDeepCopy = this.deepCloneNodes(inputs);
    for (let i = 0; i < labels.length; i++)
      labelsDeepCopy[i].appendChild(inputsDeepCopy[i]);
    return labelsDeepCopy;
  }

  deepCloneNodes(nodes) {
    let deepClonedNodes = [];
    for (const node of nodes)
      deepClonedNodes.push(node.cloneNode(true));
    return deepClonedNodes;
  }

  appendFormElements(elements) {
    const form = document.createElement('form');
    const elementsDeepCopy = this.deepCloneNodes(elements);
    const submitButton = this.createSubmitButton('Create to-do');
    form.setAttribute('method', 'post');
    elementsDeepCopy.push(submitButton);
    for (const element of elementsDeepCopy)
      form.appendChild(element);
    form.addEventListener('click', this.handleButtons);
    return form;
  }

  createSubmitButton(value) {
    const submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('value', value);
    return submitButton;
  }

  handleButtons = (event) => {
    // Cancel button 
    if (event.target.type === 'button')
      this.removeForm();
    // Submit button
    if (event.target.type === 'submit')
      this.gatherFormData(event);
  }

  removeForm() {
    const form = document.querySelector('form');
    form.remove();
  }

  gatherFormData(event) {
    event.preventDefault();
    const todoTitle = document.querySelector("[name='todo-title']").value;
    const todoDescription = document.querySelector("[name='todo-description']").value;
    const todoDueDate = document.querySelector("[name='todo-dueDate']").value;
    const todoPriority = document.querySelector("[name='todo-priority']").value;
  }
}
