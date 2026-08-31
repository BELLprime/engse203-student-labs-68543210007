function PriorityBadge({ priority }) {
  let label = 'ไม่ระบุ';
  let badgeClass = 'priority-unknown';

  if (priority === 'urgent') {
    label = 'เร่งด่วน';
    badgeClass = 'priority-urgent';
  } else if (priority === 'normal') {
    label = 'ปกติ';
    badgeClass = 'priority-normal';
  }

  return <span className={badgeClass}>{label}</span>;
}

export default PriorityBadge;