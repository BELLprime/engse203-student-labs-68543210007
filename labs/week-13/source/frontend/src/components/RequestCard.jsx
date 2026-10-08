import { Link } from 'react-router-dom';
import { useAuth } from '../services/authService.jsx';

function RequestCard({ request, onDeleteRequest }) {
  const { isStaff } = useAuth();
  
  return (
    <article className="request-card">
      <div>
        <p className="request-id">{request.id}</p>
        <h3><Link to={`/requests/${request.id}`}>{request.requestType}</Link></h3>
        <p>{request.location}</p>
        <p>{request.details}</p>
        <p><span className={`badge ${request.status}`}>{request.status}</span> · {request.priority}</p>
      </div>
      {/* ถ้า isStaff show "ลบ" */}
      {isStaff && (
        <button 
          className="button danger" 
          type="button" 
          onClick={() => onDeleteRequest(request.id)} 
          aria-label={`ลบคำร้อง ${request.id}`}
        >
          ลบ
        </button>
      )}
    </article>
  );
}

export default RequestCard;
