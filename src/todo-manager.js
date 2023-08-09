import Todo from "./todo";

export default class TodoManager {
  validateTodoForm = (event, args) => {
    const { dco } = args;
    const formData = this.gatherTodoFormData(event, dco);
    const result = this.validateFormData(formData);
    if (result) {
      // Add something to notify error to user (maybe use a modal)
      console.log("Couldn't create To-do");
      return;
    }
    const { pm } = args;
    const projectObject = this.getProjectObject(dco, pm);
    args.actionFunction(formData, dco, projectObject, args);
    dco.removeForm();
  };

  gatherTodoFormData = (event, dco) => {
    event.preventDefault();
    const todoTitle = dco.getElement("[name='todo-title']").value;
    const todoDescription = dco.getElement("[name='todo-description']").value;
    const todoDueDate = dco.getElement("[name='todo-dueDate']").value;
    const todoPriority = dco.getElement("[name='todo-priority']").value;
    const todoProject = dco.getCurrentProjectName();
    return {
      title: todoTitle,
      description: todoDescription,
      dueDate: todoDueDate,
      priority: todoPriority,
      project: todoProject,
    };
  };

  validateFormData(formData) {
    const values = Object.values(formData);
    return values.some((value) => value === "");
  }

  addTodoToProject = (formData, dco, projectObject) => {
    const newTodo = this.createTodo(formData);
    newTodo.save();
    projectObject.addTodo(newTodo);
    projectObject.save();
    dco.loadTodo(dco.createTodo(newTodo.title, newTodo.dueDate));
  };

  getProjectObject(dco, pm) {
    const projectName = dco.getCurrentProjectName();
    return pm.searchProject(projectName);
  }

  createTodo(formData) {
    return new Todo({
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
      project: formData.project,
    });
  }

  editTodo(formData, dco, projectObject, args) {
    const { todoObject } = args;
    const todoP = dco.getTodoParagraph(todoObject.title);
    const todoLi = todoP.parentElement;
    todoObject.updateProperties(formData);
    todoObject.save();
    projectObject.updateTodo(todoObject);
    projectObject.save();
    dco.updateTodoLi(todoP, todoObject);
    if (!dco.isTodoCollapsed(todoLi)) {
      dco.collapseTodo(todoLi);
      dco.expandTodo(todoLi, todoObject);
    }
  }
}
