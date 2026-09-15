import { useEffect, useState } from 'react'
import sun from '../assets/icon-sun.svg'
import moon from '../assets/icon-moon.svg'
export const TodoList = () => {
    const [inputValue, setInputValue] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editValue, setEditValue] = useState('')
    const [filter, setFilter] = useState('all')
    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem("myTodoList");
        return savedTodos ? JSON.parse(savedTodos) : [];
    });


    const handleAddTodo = (e) => {
        if (e.key !== 'Enter' || inputValue.trim() === '') return;
        setTodos([...todos, { id: Date.now(), task: inputValue, status: "" }]);
        setInputValue('');
        console.log("ive been entered")
    }

    const handleStatus = (id) => {
        setTodos(todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, status: !todo.status };
            }
            return todo;
        }));
    };

    const handleDelete = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    }

    const startEditing = (todo) => {
        setEditingId(todo.id);
        setEditValue(todo.task);
    }

    const saveEdit = () => {
        const trimmedValue = editValue.trim();
        if (editingId === null || trimmedValue === '') return;

        setTodos(todos.map(todo => (
            todo.id === editingId ? { ...todo, task: trimmedValue } : todo
        )));
        setEditingId(null);
        setEditValue('');
    }

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('');
    }

    const handleEditKeyDown = (event) => {
        if (event.key === 'Enter') saveEdit();
        if (event.key === 'Escape') cancelEdit();
    }

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.status;
        if (filter === 'completed') return todo.status;
        return true;
    });

    useEffect(() => {
        localStorage.setItem("myTodoList", JSON.stringify(todos));
    }, [todos]);

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const changeTheme = () => {
        setIsDarkMode(prevMode => !prevMode)
        console.log("theme changed")
    }





    console.log(todos)
    return (
        <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
            <div className="header-bg">
                <div className="todo-header">
                    <div className="todo-header-inner">
                        <div className="header-inner-bx">
                            <h1>TODO</h1>
                        </div>
                        <div className="header-inner-bx">
                        </div>
                    </div>
                </div>
            </div>
            <div className="todo-main-div">
                <div className="child-div">
                    <div className="input-div">
                        <input value={inputValue}
                            onChange={handleChange}
                            onKeyDown={handleAddTodo}
                            placeholder='Enter a to-do item...'
                        />
                    </div>
                    <div className="todo-list">
                        {filteredTodos.length === 0 ? <p style={{ padding: '20px' }}>
                            {todos.length === 0 ? 'No todos yet' : `No ${filter} todos`}
                        </p> : <ul>
                            {filteredTodos.map(todo => (
                                <div key={todo.id} className='todo-item'>
                                    <div className="todo-item-child">
                                        <input type="checkbox"
                                            checked={todo.status} onChange={() => handleStatus(todo.id)} />
                                        {editingId === todo.id ? (
                                            <input
                                                className="edit-input"
                                                value={editValue}
                                                autoFocus
                                                onChange={(event) => setEditValue(event.target.value)}
                                                onBlur={saveEdit}
                                                onKeyDown={handleEditKeyDown}
                                                aria-label={`Edit ${todo.task}`}
                                            />
                                        ) : (
                                            <li
                                                className='list-items'
                                                style={todo.status ? { textDecoration: 'line-through', } : {}}
                                                onDoubleClick={() => startEditing(todo)}
                                            >
                                                {todo.task}
                                            </li>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="delete-button"
                                        aria-label={`Delete ${todo.task}`}
                                        title="Delete todo"
                                        onClick={() => handleDelete(todo.id)}
                                    >
                                        &times;
                                    </button>
                                </div>

                            ))}
                        </ul>
                        }
                    </div>

                    <button onClick={changeTheme} className='theme-btn'>
                        <img src={isDarkMode ? moon : sun} alt="" />
                    </button>
                    <div className="bottom-div">
                        {['all', 'active', 'completed'].map(filterOption => (
                            <button
                                key={filterOption}
                                type="button"
                                className={filter === filterOption ? 'filter-button active' : 'filter-button'}
                                onClick={() => setFilter(filterOption)}
                            >
                                {filterOption[0].toUpperCase() + filterOption.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}