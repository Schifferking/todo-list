export default class Todo {
  constructor(args) {
    this.title = args['title'];
    this.description = args['description'];
    this.dueDate = args['dueDate'];
    this.priority = args['priority'];
  }
}
