import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

function Todos() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function getTodos() {
      try {
        const { data, error } = await supabase.from("todos").select();
        if (error) throw error;

        setTodos(data || []); // Handle empty arrays gracefully
      } catch (err) {
        console.error("Error fetching todos:", err.message);
      }
    }

    getTodos();
  }, []);

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li> // Adjust key & field based on your table structure
        ))}
      </ul>
    </div>
  );
}

export default Todos;
