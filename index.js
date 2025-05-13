function createElement(tag, attributes = {}, children = [], eventListeners = {}) {
  const element = document.createElement(tag);

  Object.keys(attributes).forEach((key) => {
    if (key === 'checked') {
      element.checked = attributes[key];
    } else if (key === 'value') {
      element.value = attributes[key];
    } else {
      element.setAttribute(key, attributes[key]);
    }
  });

  Object.keys(eventListeners).forEach((event) => {
    element.addEventListener(event, eventListeners[event]);
  });

  if (Array.isArray(children)) {
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      }
    });
  } else if (typeof children === "string") {
    element.appendChild(document.createTextNode(children));
  } else if (children instanceof HTMLElement) {
    element.appendChild(children);
  }

  return element;
}

class Component {
  constructor() {}
  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }
}

class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      tasks: [
        { id: 1, text: "Сделать домашку", completed: false },
        { id: 2, text: "Сделать практику", completed: false },
        { id: 3, text: "Пойти домой", completed: false }
      ],
      newTaskText: ""
    };
  }

  onAddInputChange(event) {
    this.state.newTaskText = event.target.value;
  }

  onAddTask() {
    const text = this.state.newTaskText.trim();
    if (!text) return;
    const newTask = {
      id: Date.now(),
      text,
      completed: false
    };
    this.state.tasks.push(newTask);
    this.state.newTaskText = "";
    this.update();
  }

  toggleTask(id) {
    this.state.tasks = this.state.tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.update();
  }

  removeTask(id) {
    this.state.tasks = this.state.tasks.filter(task => task.id !== id);
    this.update();
  }

  update() {
    const newDomNode = this.render();
    this._domNode.parentNode.replaceChild(newDomNode, this._domNode);
    this._domNode = newDomNode;
  }

  renderTask(task) {
    return createElement("li", {}, [
      createElement("input", {
        type: "checkbox",
        checked: task.completed
      }, [], {
        change: () => this.toggleTask(task.id)
      }),
      createElement("label", {}, task.text),
      createElement("button", {}, "🗑️", {
        click: () => this.removeTask(task.id)
      })
    ]);
  }

  render() {
    return createElement("div", { class: "todo-list" }, [
      createElement("h1", {}, "TODO List"),
      createElement("div", { class: "add-todo" }, [
        createElement("input", {
          id: "new-todo",
          type: "text",
          placeholder: "Задание",
          value: this.state.newTaskText
        }, [], {
          input: (e) => this.onAddInputChange(e)
        }),
        createElement("button", { id: "add-btn" }, "+", {
          click: () => this.onAddTask()
        }),
      ]),
      createElement("ul", { id: "todos" },
          this.state.tasks.map(task => this.renderTask(task))
      ),
    ]);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.appendChild(new TodoList().getDomNode());
});