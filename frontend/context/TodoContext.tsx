import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '@/config/config';

type Todo = {
    _id: string;
    title: string;
    description: string;
};

type TodoContextType = {
    todos: Todo[];
    fetchTodos: () => void;
    updateTodo: (updatedTodo: Todo) => void;
};

type TodoProviderProps = {
    children: ReactNode;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
    const [todos, setTodos] = useState<Todo[]>([]);

const fetchTodos = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    console.log("Token:", token); // Cek token

    const response = await axios.get(`${API_URL}/todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Response data:", response.data); // Cek response
    setTodos(response.data.data);
  } catch (error) {
    console.error("Failed to fetch todos"); // Log full error
  }
};
    const updateTodo = (updatedTodo: Todo) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo))
        );
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <TodoContext.Provider value={{ todos, fetchTodos, updateTodo }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodos = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodos must be used within a TodoProvider');
    }
    return context;
};