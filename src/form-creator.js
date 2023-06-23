export default class FormCreator {
  createToDoForm = (button) => {
    const form = this.createForm();
    const labelContents = ['*Title:', '*Description:', '*Due Date:', '*Priority:'];
    const textInputNames = ['todo-title', 'todo-description'];
    const labels = this.createLabels(labelContents);
    const inputs = this.createToDoInputs(textInputNames);
    let elements = this.appendInputsToLabels(labels, inputs);
    elements = elements.concat(this.appendButtons(button, 'to-do'));
    return this.appendElementsToForm(form, elements);
  }

  createForm() {
    let form = document.createElement('form');
    form.setAttribute('method', 'post');
    return form;
  }

  createLabels(labelContents) {
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

  createToDoInputs(textInputNames) {
    const textInputs = this.createTextInputs(textInputNames);
    const distinctInputs = this.createDistinctInputs();
    return textInputs.concat(distinctInputs);
  }

  createTextInputs(inputNames) {
    let inputs = [];
    for (const name of inputNames)
      inputs.push(this.createInput(name));
    return inputs;
  }

  createInput(name, type='') {
    const input = document.createElement('input');
    input.setAttribute('name', name);
    input.setAttribute('required', '');
    if (type)
      input.setAttribute('type', type);
    return input;
  }

  createDistinctInputs() {
    // These inputs are used in the to-do form
    const datePicker = this.createDatetimeLocalInput('todo-dueDate');
    const numberInput = this.createNumberInput('todo-priority');
    return [datePicker, numberInput];
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

  createNumberInput(name) {
    // For the moment it's only used for a priority input
    const input = this.createInput(name, 'number');
    input.setAttribute('min', '1');
    input.setAttribute('max', '3');
    input.setAttribute('placeholder', '1');
    return input;
  }

  appendInputsToLabels(labels, inputs) {
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

  appendButtons(button, value) {
    const submitButton = this.createSubmitButton(value);
    return [button, submitButton];
  }

  createSubmitButton(value) {
    const submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('value', `Create ${value}`);
    return submitButton;
  }

  appendElementsToForm(form, elements) {
    const elementsDeepCopy = this.deepCloneNodes(elements);
    for (const element of elementsDeepCopy)
      form.appendChild(element);
    return form;
  }
}
