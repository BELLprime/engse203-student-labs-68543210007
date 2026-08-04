import TaskCard from "./TaskCard.jsx";

function TaskList({ tasks , onDeleteTask  }) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state" role="status">
        <h3>ยังไม่มีรายการในสถานะนี้</h3>
        <p>ลองเปลี่ยนตัวกรองหรือเพิ่มงานใหม่</p>
      </div>
    );
  }
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={() => onDeleteTask(task.id)} 
        />
      ))}
    </div>
  );
}

export default TaskList;
