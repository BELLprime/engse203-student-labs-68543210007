const categoryLabels = {
  reading: "อ่าน/ทบทวน",
  coding: "เขียนโค้ด",
  review: "ตรวจและอธิบาย",
};

const statusLabels = {
  todo: "ต้องทำ",
  doing: "กำลังทำ",
  done: "เสร็จแล้ว",
};

function TaskCard({ task, onDelete }) {
  return (
    <article className="task-card">
      <div>
        <div className="badge-row">
          <span className={`badge status-${task.status}`}>
            {statusLabels[task.status]}
          </span>
          {task.priority === "high" && (
            <span className="badge priority-high">สำคัญ</span>
          )}
        </div>
        <h3>{task.title}</h3>
        <p>{categoryLabels[task.category]}</p>
      </div>
      <button
        className="danger-button"
        type="button"
        onClick={onDelete}
        aria-label={`ลบงาน ${task.title}`}
      >
        ลบ
      </button>
    </article>
  );
}

export default TaskCard;
