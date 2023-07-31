export default class Project {  
  constructor(name) {
    this.name = name;
    this.todos = [];
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get todos() {
    return this._todos;
  }

  set todos(value) {
    this._todos = value;
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  searchTodo(todoTitle) {
    return this.todos.find(todo => todo.title === todoTitle);
  }

  removeTodo(todoObject) {
    let todoIndex = this.getTodoIndex(todoObject);
    this.todos = this.todos.slice(0, todoIndex).
      concat(this.todos.slice(todoIndex + 1));
  }

  getTodoIndex(todoObject) {
    return this.todos.findIndex(todo =>
      JSON.stringify(todo) === JSON.stringify(todoObject));
  }

  updateTodo(todoObject) {
    let todoIndex = this.getTodoIndex(todoObject);
    this.todos[todoIndex] = todoObject;
  }
}
