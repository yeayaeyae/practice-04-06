// Аналог QMessageBox на элементе <dialog>
const titles = {
  information: "Информация",
  warning: "Предупреждение",
  critical: "Ошибка",
};

const buttonLabels = {
  ok: "ОК",
  yes: "Да",
  no: "Нет",
  cancel: "Отмена",
};

export function showMessage(type, text, buttons = ["ok"]) {
  const dialog = document.querySelector("#message-box");
  dialog.querySelector("[data-role=title]").textContent = titles[type] ?? type;
  dialog.querySelector("[data-role=text]").textContent = text;
  dialog.dataset.type = type;

  return new Promise((resolve) => {
    function finish(choice) {
      dialog.removeEventListener("cancel", onCancel);
      dialog.close(choice);
      resolve(choice);
    }
    // Закрытие клавишей Esc считается отменой
    function onCancel(event) {
      event.preventDefault();
      finish("cancel");
    }

    const actions = dialog.querySelector("[data-role=actions]");
    actions.replaceChildren(
      ...buttons.map((name) => {
        const button = document.createElement("button");
        button.type = "button";
        button.value = name;
        button.textContent = buttonLabels[name] ?? name;
        button.addEventListener("click", () => finish(name));
        return button;
      })
    );
    dialog.addEventListener("cancel", onCancel);
    dialog.showModal();
  });
}
