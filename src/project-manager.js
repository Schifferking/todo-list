import Project from './project.js';

export default class ProjectManager {
  constructor(projectObject=Project) {
    this.projectList = [];
    this.addProject(new projectObject('default'));
  }

  addProject(project) {
    this.projectList.push(project);
  }

  validateProjectForm = (event, args, projectObject=Project) => {
    let dco = args['dco'];
    const formData = this.gatherProjectFormData(event);
    if (formData === '') {
      // Add something to notify error to user (maybe create a modal)
      console.log("Couldn't create Project");
      return;
    }
    const formDataLowercase = formData.toLowerCase();
    let newProject = new projectObject(formDataLowercase);
    this.addProject(newProject);
    dco.loadProject(formDataLowercase);
  }

  gatherProjectFormData(event) {
    event.preventDefault();
    const projectName = document.querySelector("[name='project-name']").value;
    return projectName;
  }

  projectNameCoincides(project, projectName) {
    return project.name === projectName;
  }

  searchProject(projectName) {
    return this.projectList.find(project =>
      this.projectNameCoincides(project, projectName));
  }

  get projectList() {
    return this._projectList;
  }

  set projectList(value) {
    this._projectList = value;
  }

  // Function to remove project
  // Function to select project
}
