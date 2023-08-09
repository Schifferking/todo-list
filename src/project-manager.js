import Project from "./project";

export default class ProjectManager {
  constructor() {
    this.projectList = [];
  }

  handleProjectCreation = (event, args) => {
    event.preventDefault();
    const formData = this.gatherProjectFormData(args.dco);
    const result = this.validateProjectForm(formData);
    if (result) this.notifyError();
    else this.createProject(formData, args);
  };

  gatherProjectFormData(dco) {
    const projectName = dco.getElement("[name='project-name']").value;
    return projectName;
  }

  validateProjectForm = (formData) => formData === "";

  notifyError() {
    console.log("Couldn't create Project");
  }

  createProject(formData, args, ProjectObject = Project) {
    const formDataLowercase = formData.toLowerCase();
    const newProject = new ProjectObject(formDataLowercase);
    newProject.save();
    this.addProject(newProject);
    this.loadProject(formDataLowercase, args.dco, args.listenerFunction);
  }

  addProject(project) {
    this.projectList.push(project);
  }

  loadProject(projectName, dco, listener) {
    dco.loadProject(projectName);
    listener();
  }

  searchProject(projectName) {
    return this.projectList.find((project) =>
      this.projectNameCoincides(project, projectName),
    );
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
