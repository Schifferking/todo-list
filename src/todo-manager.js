import Todo from './todo.js';

export default class TodoManager {
  validateTodoForm = (event, args) => {
    let formData = this.gatherTodoFormData(event, args['dco']);
    let result = this.validateFormData(formData);
    if (result) {
      // Add something to notify error to user (maybe use a modal)
      console.log("Couldn't create To-do");
      return;
    }
    this.addTodoToProject(formData, args);
  }

  gatherTodoFormData = (event, dco) => {
    event.preventDefault();
    const todoTitle = dco.getElement("[name='todo-title']").value;
    const todoDescription = dco.getElement("[name='todo-description']").value;
    const todoDueDate = dco.getElement("[name='todo-dueDate']").value;
    const todoPriority = dco.getElement("[name='todo-priority']").value;
    return { title: todoTitle, 
             description: todoDescription,
             dueDate: todoDueDate,
             priority: todoPriority };
  }

  validateFormData(formData) {
    let values = Object.values(formData);
    return values.some(value => value === '');
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

  createTodo(formData) {
    return new Todo({ title: formData['title'],
                      description: formData['description'],
                      dueDate: formData['dueDate'],
                      priority: formData['priority'] });
  }
}
