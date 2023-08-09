export default class EventListenerAgregator {
  addNavbarListener(handleFunction, args) {
    const navbar = args.dco.getElement(".navbar");
    navbar.addEventListener("click", (event) => handleFunction(event, args));
  }

  addFormListener(validateFunction, args) {
    const form = args.dco.getElement("form");
    form.addEventListener("click", (event) =>
      args.handleFunction(event, validateFunction, args),
    );
  }

  addElementListener(element, handleFunction) {
    element.addEventListener("click", (event) => handleFunction(event));
  }
}
