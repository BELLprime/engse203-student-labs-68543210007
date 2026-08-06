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
      <AppHeader title="Study Task Board" subtitle="CP06 — Responsive UI และ Accessibility" />
      <main className="container page-content">
        <SummaryPanel summary={summary} />
        <div className="workspace-grid">
          <TaskForm onAddTask={handleAddTask}/>
          <section className="panel">
            <FilterBar value={statusFilter} onFilterChange={setStatusFilter} />
            <TaskList tasks={filteredTasks} onDeleteTask={handleDeleteTask} />
          </section>
        </div>
      </main>
    </>
  );
}

export default App;

