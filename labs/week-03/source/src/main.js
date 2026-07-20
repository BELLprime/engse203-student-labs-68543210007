import './style.css';

const form = document.querySelector('#request-form');

// TODO 1: query preview/status/list elements
const preview = {
  previewName: document.querySelector('#preview-name'),
  previewType: document.querySelector('#preview-type'),
  previewDetails: document.querySelector('#preview-details'),
  
}; 
const status = document.querySelector('#form-status');
const requestList = document.querySelector('#request-list');
const detailsCount = document.querySelector('#details-count');
const previewStatus = document.querySelector('#preview-status');

// TODO 2: readForm()
function readForm() {
    return Object.fromEntries(new FormData(form).entries());
}
// TODO 3: renderPreview(data)
function renderPreview(data) { 
  preview.previewName.textContent = data.requesterName || 'ยังไม่ระบุชื่อ'; 
  preview.previewType.textContent = data.requestType || 'ยังไม่เลือกประเภท'; 
  preview.previewDetails.textContent = data.details || 'ยังไม่มีรายละเอียด'; 
  if (detailsCount) {
        detailsCount.textContent = `${data.details.length} ตัวอักษร`;
    }
}
// TODO 4: validate(data)
function validate(data) { 
  const errors = {}; 
  if (data.requesterName.trim().length < 2) { 
    errors.requesterName = 'กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร'; 
  } 
  if (!data.requestType) { 
    errors.requestType = 'กรุณาเลือกประเภทคําขอ';
  } 
  if (data.details.trim().length < 10) { 
    errors.details = 'กรุณาอธิบายอย่างน้อย 10 ตัวอักษร'; 
  } 
  return errors; 
}  
// TODO 5: renderErrors(errors)
function renderErrors(errors) { 
  for (const name of ['requesterName', 'requestType', 'details']) { 
    const field = document.querySelector(`[name="${name}"]`); 
    const output = document.querySelector(`#${name}-error`); 
    const message = errors[name] ?? ''; 
    output.textContent = message; 
    field.setAttribute('aria-invalid', String(Boolean(message))); 
  } 
} 
//------------------------
function addRequest(data) { 
  const item = document.createElement('li'); 
  const title = document.createElement('strong'); 
  const details = document.createElement('span'); 
  title.textContent = `${data.requesterName} • ${data.requestType}`; 
  details.textContent = data.details; 
  item.append(title, details); 
  requestList.prepend(item); 
}


function renderStatus(state, message) {
  status.dataset.state = state;
  status.textContent = message;

  if (previewStatus) {
    previewStatus.dataset.state = state;
    previewStatus.textContent = message;
  }
}

function handleSubmit(form) { 
  const data = readForm(form); 
  const errors = validate(data); 
 
  renderErrors(errors); 
  if (Object.keys(errors).length > 0) { 
    renderStatus('invalid', 'กรุณาตรวจสอบข้อมูลที่ระบุ'); 
    return; 
  } 
 
  addRequest(data);
  renderStatus('success', 'บันทึกคําขอเรียบร้อย'); 
  form.reset(); 
  renderPreview(readForm(form)); 
} 
// TODO 6: input and submit listeners
form.addEventListener('input', (event) => { 
  // currentTarget คือ form; target คือ input/select/textarea ที่เปลี่ยน 
const data = Object.fromEntries(new FormData(event.currentTarget).entries()); 
renderPreview(data); 
}); 
form.addEventListener('submit', (event) => { 
  event.preventDefault(); 
  handleSubmit(event.currentTarget); 
}); 

renderPreview(readForm());
renderStatus('idle', 'พร้อมเริ่มกรอกข้อมูลใหม่');
console.log('LAB 3 starter ready', form);