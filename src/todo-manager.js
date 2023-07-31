import Todo from './todo.js';

export default class TodoManager {
  validateTodoForm = (event, args) => {
    let dco = args['dco'];
    let formData = this.gatherTodoFormData(event, dco);
    let result = this.validateFormData(formData);
    if (result) {
      // Add something to notify error to user (maybe use a modal)
      console.log("Couldn't create To-do");
      return;
    }
    let pm = args['pm'];
    let projectObject = this.getProjectObject(dco, pm);
    args['actionFunction'](formData, dco, projectObject, args);
    dco.removeForm();
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

  addTodoToProject = (formData, dco, projectObject, args) => {
    let newTodo = this.createTodo(formData);
    projectObject.addTodo(newTodo);
    dco.loadTodo(dco.createTodo(newTodo.title, newTodo.dueDate));
  }

  getProjectObject(dco, pm) {
    let projectName = dco.getCurrentProjectName();
    return pm.searchProject(projectName);
  }

  createTodo(formData) {
    return new Todo({ title: formData['title'],
                      description: formData['description'],
                      dueDate: formData['dueDate'],
                      priority: formData['priority'] });
  }

  editTodo(formData, dco, projectObject, args) {
    let todoObject = args['todoObject'];
    let todoP = dco.getTodoParagraph(todoObject.title);
    todoObject.updateProperties(formData);
    projectObject.updateTodo(todoObject);
    dco.updateTodoLi(todoP, todoObject);
  }
}
