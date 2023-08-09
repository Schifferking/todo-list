export default class FormCreator {
  createToDoForm = (button) => {
    const form = this.createForm();
    const labelContents = [
      "*Title:",
      "*Description:",
      "*Due Date:",
      "*Priority:",
    ];
    const textInputNames = ["todo-title", "todo-description"];
    const labels = this.createLabels(labelContents);
    const inputs = this.createToDoInputs(textInputNames);
    const elements = this.joinLists(
      this.appendInputsToLabels(labels, inputs),
      this.appendButtons(button, "to-do"),
    );
    return this.appendElementsToForm(form, elements);
  };

  createForm() {
    const form = document.createElement("form");
    this.assignAttribute(form, "method", "post");
    return form;
  }

  assignAttribute(element, attribute, value = "") {
    element.setAttribute(attribute, value);
  }

  createLabels(labelContents) {
    const labels = [];
    labelContents.map(content => labels.push(this.createLabel(content)));
    return labels;
  }

  createLabel(content) {
    const label = document.createElement("label");
    label.textContent = content;
    return label;
  }

  createToDoInputs(textInputNames) {
    const textInputs = this.createTextInputs(textInputNames);
    const distinctInputs = this.createDistinctInputs();
    return this.joinLists(textInputs, distinctInputs);
  }

  createTextInputs(inputNames) {
    const inputs = [];
    inputNames.map(name => inputs.push(this.createInput(name)));
    return inputs;
  }

  createInput(name, type = "text") {
    const input = document.createElement("input");
    const attributes = ["name", "required"];
    const values = [name, ""];
    if (type) {
      attributes.push("type");
      values.push(type);
    }
    this.assignAttributes(input, attributes, values);
    return input;
  }

  assignAttributes(element, attributes, values) {
    for (let i = 0; i < attributes.length; i += 1)
      this.assignAttribute(element, attributes[i], values[i]);
  }

  createDistinctInputs() {
    // These inputs are used in the to-do form
    const datePicker = this.createDatetimeLocalInput("todo-dueDate");
    const numberInput = this.createNumberInput("todo-priority");
    return [datePicker, numberInput];
  }

  createDatetimeLocalInput(name) {
    const input = this.createInput(name, "datetime-local");
    this.assignAttribute(input, "value", this.getCurrentDate());
    return input;
  }

  getCurrentDate() {
    // Returns in the format yyyy-MM-DD-Thh:mm
    return new Date().toJSON().slice(0, 19);
  }

  createNumberInput(name) {
    // For the moment it's only used for a priority input
    const input = this.createInput(name, "number");
    const minValue = "1";
    const maxValue = "3";
    const attributes = ["min", "max", "placeholder"];
    const values = [minValue, maxValue, minValue];
    this.assignAttributes(input, attributes, values);
    return input;
  }

  appendInputsToLabels(labels, inputs) {
    const labelsDeepCopy = this.deepCloneNodes(labels);
    const inputsDeepCopy = this.deepCloneNodes(inputs);
    for (let i = 0; i < labels.length; i += 1)
      labelsDeepCopy[i].appendChild(inputsDeepCopy[i]);
    return labelsDeepCopy;
  }

  joinLists(firstList, secondList) {
    return firstList.concat(secondList);
  }

  deepCloneNodes(nodes) {
    const deepClonedNodes = [];
    nodes.map(node => deepClonedNodes.push(node.cloneNode(true)));
    return deepClonedNodes;
  }

  appendButtons(button, value) {
    const submitButton = this.createSubmitButton(value);
    return [button, submitButton];
  }

  createSubmitButton(value) {
    const submitButton = document.createElement("input");
    const attributes = ["type", "value"];
    const values = ["submit", `Create ${value}`];
    this.assignAttributes(submitButton, attributes, values);
    return submitButton;
  }

  appendElementsToForm(form, elements) {
    const elementsDeepCopy = this.deepCloneNodes(elements);
    elementsDeepCopy.map(element => form.appendChild(element));
    return form;
  }

  createProjectForm = (button) => {
    const form = this.createForm();
    const label = this.createLabels(["*Name:"]);
    const input = this.createTextInputs(["project-name"]);
    const elements = this.joinLists(
      this.appendInputsToLabels(label, input),
      this.appendButtons(button, "project"),
    );
    return this.appendElementsToForm(form, elements);
  };
}
