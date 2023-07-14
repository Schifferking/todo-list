import Project from './project.js';

export default class ProjectManager {
  constructor(projectObject=Project) {
    this.projectList = [];
    this.addProject(new projectObject('default'));
  }

  handleProjectCreation = (event, args) => {
    event.preventDefault();
    const formData = this.gatherProjectFormData(args['dco']);
    let result = this.validateProjectForm(formData);
    if (result)
      this.displayErrorModal();
    else
      this.createProject(formData, args);
  }

  gatherProjectFormData(dco) {
    const projectName = dco.getElement("[name='project-name']").value;
    return projectName;
  }

  validateProjectForm = (formData) => {
    return formData === '';
  }

  displayErrorModal() {
    console.log("Couldn't create Project");
  }

  createProject(formData, args, projectObject=Project) {
    const formDataLowercase = formData.toLowerCase();
    let newProject = new projectObject(formDataLowercase);
    this.addProject(newProject);
    args['dco'].loadProject(formDataLowercase);
    // Add listener to todo list
    args['listenerFunction']();
  }

  addProject(project) {
    this.projectList.push(project);
  }

  searchProject(projectName) {
    return this.projectList.find(project =>
      this.projectNameCoincides(project, projectName));
  }

  projectNameCoincides(project, projectName) {
    return project.name === projectName;
  }

  get projectList() {
    return this._projectList;
  }

  set projectList(value) {
    this._projectList = value;
  }

  // Function to remove project
}
