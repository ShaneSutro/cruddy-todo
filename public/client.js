$(() => {

  // View ////////////////////////////////////////////////////////////////////////

  var template = _.template(`
    <li data-id="<%=id%>" class="todo">
      <span><%=text%></span>
      <button data-action="edit">edit</button>
      <button data-action="done">&#x2714;</button>
      <button data-action="up">&#9650;</button>
      <button data-action="down">&#9660;</button>
    </li>
  `);

  var renderTodo = (todo) => {
    return template(todo);
  };

  var addTodo = (todo) => {
    $('#todos').append(renderTodo(todo));
  };

  var changeTodo = (id, todo) => {
    $(`#todos [data-id=${id}]`).replaceWith(renderTodo(todo));
  };

  var removeTodo = (id) => {
    $(`#todos [data-id=${id}]`).remove();
  };

  var addAllTodos = (todos) => {
    _.each(todos, (todo) => {
      addTodo(todo);
    });
  };

  // Controller //////////////////////////////////////////////////////////////////

  $('#form button').click( (event) => {
    var text = $('#form input').val().trim();
    if (text) {
      Todo.create(text, addTodo);
    }
    $('#form input').val('');
  });

  $('#todos').delegate('button', 'click', (event) => {
    var id = $(event.target.parentNode).data('id');
    var action = $(event.target).data('action');
    if (action === 'edit') {
      Todo.readOne(id, (todo) => {
        var updatedText = prompt('Change to?', todo.text);
        if (updatedText !== null && updatedText !== todo.text) {
          Todo.update(id, updatedText, changeTodo.bind(null, id));
        }
      });
    } else if (action === 'up') {
      var prevSiblingID = $(event.target.parentNode).prev().data('id');
      if (prevSiblingID) {
        Todo.swap(id, prevSiblingID, () => {
          changeTodo(id, $(`li[data-id=${prevSiblingID}] span`).text());
          changeTodo(prevSiblingID, $(`li[data-id=${id}] span`).text());
        });
      }
    } else if (action === 'down') {
      var nextSiblingID = $(event.target.parentNode).next().data('id');
      if (nextSiblingID) {
        Todo.swap(id, nextSiblingID, () => {
          changeTodo(id, $(`li[data-id=${nextSiblingID}] span`).text());
          changeTodo(nextSiblingID, $(`li[data-id=${id}] span`).text());
        });
      }
    } else if (action === 'done') {
      Todo.delete(id, removeTodo.bind(null, id));
    }
  });

  // Initialization //////////////////////////////////////////////////////////////

  console.log('CRUDdy Todo client is running the browser');
  Todo.readAll(addAllTodos);

});
