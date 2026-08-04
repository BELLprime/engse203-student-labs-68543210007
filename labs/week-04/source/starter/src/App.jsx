import { useState } from 'react';
import AppHeader from './components/AppHeader.jsx';
import SummaryPanel from './components/SummaryPanel.jsx';
import FilterBar from './components/FilterBar.jsx';
import TaskList from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';//cp04
import { initialTasks } from './data/initialTasks.js';

function App() {
  const [tasks,setTasks] = useState(initialTasks);
  const [statusFilter, setStatusFilter] = useState('all');

  const summary = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    doing: tasks.filter((task) => task.status === 'doing').length,
    done: tasks.filter((task) => task.status === 'done').length,
  };
  const filteredTasks = statusFilter === 'all'
    ? tasks
    : tasks.filter((task) => task.status === statusFilter);
  //ADD
  function handleAddTask(taskData) {
    const newTask = {
      id: `TASK-${Date.now()}`,
      ...taskData,
      status: "todo",
    };
    setTasks((currentTasks) => [newTask, ...currentTasks]);
  }
  //Del
  function handleDeleteTask(taskId) { //เก็บเฉพาะ task ที่ id ไม่ตรง = ลบตัวที่ตรง
    setTasks((currTasks) => 
      currTasks.filter((task) => task.id !== taskId),
    );
  }

  return (
    <>
      <AppHeader title="Study Task Board" subtitle="CP03 — State, derived data และ filter" />
      <main className="container page-content">
        <SummaryPanel summary={summary} />
        <section className="panel">
          <FilterBar value={statusFilter} onFilterChange={setStatusFilter} />
          <TaskList tasks={filteredTasks} onDeleteTask={handleDeleteTask} />
          <TaskForm onAddTask={handleAddTask}/>
        </section>
      </main>
    </>
  );
}

export default App;

