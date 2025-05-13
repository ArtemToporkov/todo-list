function createElement(tag, attributes, children, callbacks) {
  const element = document.createElement(tag);

  // Обработка атрибутов с учетом специальных свойств
  if (attributes) {
    Object.keys(attributes).forEach((key) => {
      if (key === 'checked') {
        element.checked = attributes[key];
      } else {
        element.setAttribute(key, attributes[key]);
      }
    });
  }

  // Обработка колбэков
  if (callbacks) {
    for (const [action, func] of Object.entries(callbacks)) {
      const eventName = action.toLowerCase().replace('on', '');
      element.addEventListener(eventName, func);
    }
  }

  // Обработка дочерних элементов
  const appendChild = (child) => {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    }
  };

  if (Array.isArray(children)) {
    children.forEach(appendChild);
  } else if (children) {
    appendChild(children);
  }

  return element;
}

class Component {
  constructor() {
    this.state = {
      tasks: [
        { id: 1, text: "Сделать домашку", completed: false },
        { id: 2, text: "Сделать практику", completed: false },
        { id: 3, text: "Пойти домой", completed: false }
      ]
    };
  }

  getDomNode() {
    this._domNode = this.render();
    return this._domNode;
  }

  update() {
    const newDomNode = this.render();
    this._domNode.replaceWith(newDomNode);
    this._domNode = newDomNode;
  }
}

class AddTask extends Component {
  constructor(onAddTask) {
    super();
    this.onAddTask = onAddTask;
    this.inputValue = '';
  }

  render() {
    return createElement("div", { class: "add-todo" }, [
      createElement("input", {
        type: "text",
        placeholder: "Задание",
        value: this.inputValue
      }, null, {
        onInput: (e) => this.inputValue = e.target.value
      }),
      createElement("button", {
        class: "add-btn",
        style: "background: #007bff; color: white; border: none; padding: 4px 8px; cursor: pointer;"
      }, "+", {
        onClick: () => {
          if (this.inputValue.trim()) {
            this.onAddTask({
              id: Date.now(),
              text: this.inputValue.trim(),
              completed: false
            });
            this.inputValue = '';
            this.update();
          }
        }
      })
    ]);
  }
}

class Task extends Component {
  constructor(task, onToggle, onDelete) {
    super();
    this.task = task;
    this.onToggle = onToggle;
    this.onDelete = onDelete;
    this.confirmDelete = false;
  }

  render() {
    const labelStyle = this.task.completed
        ? "text-decoration: line-through; color: #666;"
        : "color: #333;";

    return createElement("li", { style: "margin: 8px 0;" }, [
      createElement("input", {
        type: "checkbox",
        checked: this.task.completed
      }, null, {
        onChange: () => this.onToggle(this.task.id)
      }),
      createElement("label", {
        style: `${labelStyle} margin-left: 8px; margin-right: 12px;`
      }, this.task.text),
      createElement("button", {
        style: this.confirmDelete
            ? "background: #dc3545; color: white; border: none; padding: 4px 8px; cursor: pointer;"
            : "background: #6c757d; color: white; border: none; padding: 4px 8px; cursor: pointer;"
      }, this.confirmDelete ? "Удалить?" : "🗑️", {
        onClick: () => {
          if (!this.confirmDelete) {
            this.confirmDelete = true;
            this.update();
          } else {
            this.onDelete(this.task.id);
          }
        }
      })
    ]);
  }
}

class TodoList extends Component {
  constructor() {
    super();
  }

  handleAddTask = (newTask) => {
    this.state.tasks = [...this.state.tasks, newTask];
    this.update();
  };

  handleDeleteTask = (taskId) => {
    this.state.tasks = this.state.tasks.filter(task => task.id !== taskId);
    this.update();
  };

  handleToggleTask = (taskId) => {
    this.state.tasks = this.state.tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    this.update();
  };

  render() {
    return createElement("div", { class: "todo-list", style: "max-width: 600px; margin: 20px auto; padding: 20px;" }, [
      createElement("h1", { style: "color: #333; text-align: center;" }, "TODO List"),
      new AddTask(this.handleAddTask).getDomNode(),
      createElement("ul", {
        style: "list-style: none; padding: 0; margin: 20px 0;"
      }, this.state.tasks.map(task =>
          new Task(task, this.handleToggleTask, this.handleDeleteTask).getDomNode()
      ))
    ]);
  }
}

// Инициализация приложения
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.backgroundColor = "#f8f9fa";
  document.body.appendChild(new TodoList().getDomNode());
});