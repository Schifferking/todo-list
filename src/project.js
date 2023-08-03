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

  addTodos(todos) {
    for (let todo of todos)
      this.addTodo(todo);
  }

  addTodo(todo) {
    this.todos.push(todo);
  }

  searchTodo(todoTitle) {
    return this.todos.find(todo => todo.title === todoTitle);
  }

  removeTodo(todoObject) {
    this.delete(todoObject.title);
    let todoIndex = this.getTodoIndex(todoObject);
    this.todos = this.todos.slice(0, todoIndex).
      concat(this.todos.slice(todoIndex + 1));
    this.save();
  }

  getTodoIndex(todoObject) {
    return this.todos.findIndex(todo =>
      JSON.stringify(todo) === JSON.stringify(todoObject));
  }

  updateTodo(todoObject) {
    let todoIndex = this.getTodoIndex(todoObject);
    this.todos[todoIndex] = todoObject;
  }

  save() {
    localStorage.setItem(this.name, JSON.stringify(this));
  }

  delete(todoName) {
    localStorage.removeItem(todoName);
  }
}
