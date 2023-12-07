import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios'

// Functional component ('Todo') that represents a single row in the table displaying the to-do list. It takes 'props' as an argument, which includes the to-do item ('props.todo') and a function to delete the to-do item ('props.deleteTodo')

// Functional component ('Todo') that represents a single row in the table displaying the to-do list. It takes 'props' as an argument, which includes the to-do item ('props.todo') and a function to delete the to-do item ('props.deleteTodo'
const Todo = props => (
    <tr className="d-flex">
        <td className='col-1'>
            <input
                type="checkbox"
                checked={props.todo.completed}
                onChange={() => props.toggleTodoCompleted(props.todo._id)}
            />
        </td>
        <td className={`col-9 ${props.todo.completed ? `completed` : ''}`}>
            {props.todo.activity}
        </td>    
        <td className='col-2' style={{ textAlign: "right" }}>
            <button onClick={() => { props.editTodo(props.todo._id) }} >EDIT</button>
            <button onClick={() => { props.deleteTodo(props.todo._id) }} >DELETE</button>
        </td>
    
</tr>)

// "TodosList" class component is defined, extending the 'Component' class (malabo pa rin to sa akin)
export default class TodosList extends Component {
    
    // The constructor method is a special method that gets called when an instance of the class is created. It's used to initialize the component's state and bind event handler methods.
    constructor(props) {

        // Calls the constructor of the parent class (Component in this case). It's necessary to call super(props) to ensure that the base class is properly initialized.
        super(props);

        // Binds the deleteTodo method to the current instance of the component. This is necessary to make sure that this inside deleteTodo refers to the component instance.
        this.toggleTodoCompleted = this.toggleTodoCompleted.bind(this);
        this.editTodo = this.editTodo.bind(this)
        this.deleteTodo = this.deleteTodo.bind(this)


        // Initializes the component's state with an empty array for todos. State is used to manage data that may change over time and trigger re-renders.
        this.state =
        {
            todos: [], // setup todos as an array
            editingTodo: null, // Keep track of the todo being edited
        };
    }

    // What is the use of 'componentDidMount' lifecycle method? 
    // the class component uses the componentDidMount lifecycle method to fetch data when the component is mounted. In functional components, the equivalent effect can be achieved using the useEffect hook.

    
    componentDidMount() {
        // Used to fetch to-do items from a specified API endpoint
        axios
            .get('https://tracker-fe-practice.onrender.com/todos/')
            .then(response => {
                console.log(response.data); // Log the received data
                this.setState({ todos: response.data || [] });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    toggleTodoCompleted(id) {
          // Find the todo item by ID
        const todoToUpdate = this.state.todos.find(todo => todo._id === id);
        
        // Make a PUT request to update the 'completed' property of the todo
        axios
          .post(`https://tracker-fe-practice.onrender.com/todos/update/${id}`, {
              completed: !todoToUpdate.completed, // Toggle the completed property
              activity: todoToUpdate.activity, // Include the activity filled in the payload
          })
            .then(response => {
                // Ensure the response data is an array
                // const updatedTodos = Array.isArray(response.data) ? response.data : []; -> keeping this just in case I'll need it

                // this handles the issue about page having to be refreshed first since it loads blank
                // { ...todo }: This creates a new object with all the properties of the original todo object. It's a concise way of copying the properties.
                // { ...todo, completed: !todo.completed }: This takes the copied properties of todo and updates the completed property to its opposite value (!todo.completed).
                // This usage of the spread syntax helps ensure immutability, which is often a good practice in React. It prevents unintentional side effects when updating state and helps with better state management.

                this.setState(prevState => ({
                    todos: prevState.todos.map(todo =>
                        todo._id === id ? { ...todo, completed: !todo.completed } : todo
                    ),
                }));
          })
          .catch(error => {
            console.error('Update failed :(', error.response);
          });
      }

    // The deleteTodo method is used to delete a to-do item. It makes an HTTP DELETE request to the specified API endpoint, 
    // and if successful, it updates the state by removing the deleted item from the todos array using filter.
    editTodo(id) {
        // Set the editingTodo in the state to the todo with the given id, issue ko dito is pagkaclick ng Edit hindi instant!!
        this.setState((prevState) => {
            return {
                editingTodo: prevState.todos.find((todo) => todo._id === id),
            }
            
          });
    }

    handleEditFormSubmit = async (event) => {
        event.preventDefault();
    
        const { _id, activity } = this.state.editingTodo;
        try {
            // Make a POST request to update the todo
            const response = await axios.post(`https://tracker-fe-practice.onrender.com/todos/update/${_id}`, { activity })
            console.log("Updated successfully!", response.data);

            if (Array.isArray(response.data)) {
                // Clear the editingTodo and update the state with the new todos
                              
                this.setState({
                    editingTodo: null,
                    todos: response.data,
                });

                setTimeout(() => {
                    window.location.reload();
                }, 100);        

            }
        } catch (error) {
            console.error("Updated failed :(", error.response);
        }
      };
    
      handleEditInputChange = (event) => {
        // Update the editingTodo in the state with the new value
        this.setState({
          editingTodo: {
            ...this.state.editingTodo,
            activity: event.target.value,
          },
        });
      };
    
    deleteTodo(id) {
        axios
            .delete('https://tracker-fe-practice.onrender.com/todos/' + id)
            .then(response => { console.log(response.data) });
        this.setState({
            todos: this.state.todos.filter(el => el._id !== id)
        })
    }

    // The todoList method maps over the todos array in the component's state and generates a list of Todo components. Each Todo component is passed the corresponding to-do item and the deleteTodo method.
    todoList() {
        return this.state.todos.map(currenttodo => {
            return <Todo
                todo={currenttodo}
                editTodo={this.editTodo}
                deleteTodo={this.deleteTodo}
                toggleTodoCompleted={this.toggleTodoCompleted}
                key={currenttodo._id}
            />;
        })
    }
    
    // The render method returns the JSX that defines the structure of the component. It includes a table with a header and body. 
    // The todoList method is called to render the to -do items as rows in the table.
    render() {
        return (
            <div>
                <h3>Logged Todos</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Activity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.todoList()}
                    </tbody>
                </table>
                {/* Render the edit form if editingTodo is not null */}
                {this.state.editingTodo && (
                    <form onSubmit={this.handleEditFormSubmit}>
                        <label>
                            Edit Todo:
                            <input
                                type="text"
                                value={this.state.editingTodo.activity}
                                onChange={this.handleEditInputChange}
                            />
                        </label>
                        <button type="submit">Save</button>
                    </form>
        )}
        </div>
        )
    }
}