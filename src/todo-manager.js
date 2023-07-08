import Todo from './todo.js';

export default class TodoManager {
  validateTodoForm = (event, args) => {
    const formData = this.gatherTodoFormData(event);
    if (formData.includes('')) {
      // Add something to notify error to user (maybe use a modal)
      console.log("Couldn't create To-do");
      return;
    }
    this.addTodoToProject(formData, args);
  }

  createTodo(formData) {
    return new Todo({title: formData[0], description: formData[1],
                     dueDate: formData[2], priority: formData[3]});
  }

  addTodoToProject(formData, args) {
    let pm = args['pm'];
    let dco = args['dco'];
    let newTodo = this.createTodo(formData);
    let projectName = dco.getCurrentProjectName();
    let projectObject = pm.searchProject(projectName);
    projectObject.addTodo(newTodo);
    dco.loadTodo(dco.createTodo(newTodo.title, newTodo.description));
    dco.removeForm();
  }

  gatherTodoFormData = (event) => {
    event.preventDefault();
    const todoTitle = document.querySelector("[name='todo-title']").value;
    const todoDescription = document.querySelector("[name='todo-description']").value;
    const todoDueDate = document.querySelector("[name='todo-dueDate']").value;
    const todoPriority = document.querySelector("[name='todo-priority']").value;
    return [todoTitle, todoDescription, todoDueDate, todoPriority];
  }
}
