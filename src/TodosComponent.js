import TodoComponent from './TodoComponent.js';

class TodosComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      todos: []
    };
  }

  componentDidMount() {
    Todo.readAll((todos) => {
      console.log(todos);
      this.setState({ todos });
    });
  }

  render() {
    return (
      <div>
        <h3>CRUDdy Todo</h3>
        <div id="form">
          <input type="input"></input>
          <button>add</button>
        </div>
        <hr/>
        <ul id="todos">
          {this.state.todos.map((todo, i) => {
            return (<TodoComponent todo={todo} key={i}/>);
          })}
        </ul>
      </div>
    );
  }
}
// PropTypes tell other developers what `props` a component expects
// Warnings will be shown in the console when the defined rules are violated
TodosComponent.propTypes = {
};

export default TodosComponent;
