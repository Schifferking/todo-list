export default class Todo {
  constructor(args) {
    this.title = args['title'];
    this.description = args['description'];
    this.dueDate = args['dueDate'];
    this.priority = args['priority'];
    this.project = args['project'];
  }

  updateProperties(formData) {
    for (let key of Object.keys(this))
      this[key] = formData[key];
  }

  save() {
    localStorage.setItem(this.title, JSON.stringify(this));
  }
}
