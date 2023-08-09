export default class Todo {
  constructor(args) {
    this.title = args.title;
    this.description = args.description;
    this.dueDate = args.dueDate;
    this.priority = args.priority;
    this.project = args.project;
  }

  updateProperties(formData) {
    Object.keys(this).map((key) => {
      this[key] = formData[key];
      return this;
    });
  }

  save() {
    localStorage.setItem(this.title, JSON.stringify(this));
  }
}
