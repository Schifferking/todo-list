import Todo from './todo.js';

export default class ToDOManager {
  validateToDoForm = (event, dco) => {
    const formData = this.gatherToDoFormData(event);
    if (formData.includes('')) {
      // Add something to notify error to user (maybe use a modal)
      console.log("Couldn't create To-do");
      return;
    }
    // Create To-do object
    let newToDo = new Todo(formData[0], formData[1], formData[2], formData[3]);
    // Select project
    let projectName = dco.getCurrentProjectName();
    // Get project object
    // Add to-do to project object
    // Create li with to-do information
    dco.removeForm();
  }

  gatherToDoFormData = (event) => {
    event.preventDefault();
    const todoTitle = document.querySelector("[name='todo-title']").value;
    const todoDescription = document.querySelector("[name='todo-description']").value;
    const todoDueDate = document.querySelector("[name='todo-dueDate']").value;
    const todoPriority = document.querySelector("[name='todo-priority']").value;
    return [todoTitle, todoDescription, todoDueDate, todoPriority];
  }
}
