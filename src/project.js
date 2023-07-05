export default class Project {  
  constructor(name) {
    this.name = name;
    this.todos = [];
  }

  addTodo(todo) {
    this.todos.push(todo);
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

  removeTodo() {
    // get the index of the element to be removed (create other function for it)
    // use the next line
    // this.todos = this.todos.slice(0, n).concat(this.todos.slice(n + 1))
  }
}
