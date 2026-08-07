import AppHeader from "./components/AppHeader.jsx";
import SummaryPanel from "./components/SummaryPanel.jsx";
import RequestForm from "./components/RequestForm.jsx";
import FilterBar from "./components/FilterBar.jsx";
import RequestList from "./components/RequestList.jsx";
import { initialRequests , generateRequestId  } from "./data/initialRequests.js";
import { useState } from "react";

function App() {
  // TODO LAB4-R04: เปลี่ยน requests/statusFilter เป็น state
  const [requests, setRequests] = useState(initialRequests);
  const [statusFilter, setStatusFilter] = useState("all");

  // TODO LAB4-R04: คำนวณ summary เป็น derived data
  const summary = {
    total: requests.length,
    pending: requests.filter((request) => request.status == "pending").length,
    inProgress: requests.filter((request) => request.status == "inProgress").length,
    completed: requests.filter((request) => request.status == "completed").length,
  };

  // TODO LAB4-R08: คำนวณ filteredRequests จาก requests + statusFilter
  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((request) => request.status === statusFilter);

  function handleAddRequest(requestData) {
    console.log("Add request", requestData);
    const newRequest = {
      id: generateRequestId(),
      ...requestData,
      status: "pending",
    };
    setRequests((currRequest) => [...currRequest ,newRequest,]);
  }

  function handleDeleteRequest(requestId) {
    console.log("Delete request", requestId);
    setRequests((currRequest) =>
      currRequest.filter((request) => request.id !== requestId),
    );
  }

  return (
    <>
      <AppHeader
        title="Campus Service Request"
        subtitle="LAB 4 Starter — เปลี่ยน DOM-driven UI เป็น State-driven React UI"
      />
      <main className="container page-content">
        <SummaryPanel summary={summary} />
        <div className="workspace-grid">
          <RequestForm onAddRequest={handleAddRequest} />
          <section className="panel" aria-labelledby="request-list-title">
            <div className="section-heading">
              <h2 id="request-list-title">รายการคำร้อง</h2>
              <FilterBar value={statusFilter} onFilterChange={setStatusFilter} />
            </div>
            <RequestList
              requests={filteredRequests}
              onDeleteRequest={handleDeleteRequest}
            />
          </section>
        </div>
      </main>
    </>
  );
}

export default App;
