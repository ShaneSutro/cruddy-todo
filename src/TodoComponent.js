var TodoComponent = props => (
  <li data-id={props.todo.id} className="todo">
    <span>{props.todo.text}</span>
    <button data-action="edit">edit</button>
    <button data-action="done">&#x2714;</button>
    <button data-action="up">&#9650;</button>
    <button data-action="down">&#9660;</button>
  </li>
);

// PropTypes tell other developers what `props` a component expects
// Warnings will be shown in the console when the defined rules are violated
TodoComponent.propTypes = {
  todo: React.PropTypes.object.isRequired
};

export default TodoComponent;
