// // import React from "react";
// // import Sidebar from "./components/Sidebar";
// // import Navbar from "./components/Navbar";
// // import Dashboard from "./components/Dashboard";
// // import LiveFeed from "./components/LiveFeed";
// // import "./App.css";
// // import RecentInspection from "./components/RecentInspection";
// // import DefectDistribution from "./components/DefectDistribution";

// // function App() {
// //   return (
// //     <div className="app-container">
// //       <Sidebar />
// //       <div className="main-content">
// //         <Navbar />
// //         {/* Other sections like Stats Cards, Live Feed, etc. will go here */}

// //         <Dashboard />
// //         <div className="live-section-container">
// //           <LiveFeed />
// //           <div className="live-section-cont1">
// //           <RecentInspection />
// //           <DefectDistribution/>
// //           </div>
          
// //         </div>
        
// //       </div>
// //     </div>
// //   );
// // }

// // export default App;


// import React, { useState } from "react";
// import Sidebar from "./components/Sidebar";
// import Navbar from "./components/Navbar";
// import Dashboard from "./components/Dashboard";
// import LiveFeed from "./components/LiveFeed";
// import "./App.css";
// import RecentInspection from "./components/RecentInspection";
// import RecordedHistory from "./components/RecordedHistory";
// import DefectDistribution from "./components/DefectDistribution";

// function App() {
//   const [inspections, setInspections] = useState([]);

//   const addInspection = (bottleId, time, defect) => {
//     setInspections((prevInspections) => [
//       { bottle: `Bottle #${bottleId}`, time, defect: defect || "No defect" },
//       ...prevInspections,
//     ]);
//   };

//   return (
//     <div className="app-container">
//       <Sidebar />
//       <div className="main-content">
//         <Navbar />
//         {/* Other sections like Stats Cards, Live Feed, etc. will go here */}

//         <Dashboard />
//         <div className="live-section-container">
//           <LiveFeed addInspection={addInspection} />
//           <div className="live-section-cont1">
//             <RecentInspection inspections={inspections} />
//             <DefectDistribution />
//           </div>
//         </div>

//         <div className="video-history">
//           <RecordedHistory/>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import LiveFeed from "./components/LiveFeed";
import "./App.css";
import RecentInspection from "./components/RecentInspection";
import RecordedHistory from "./components/RecordedHistory";
import DefectDistribution from "./components/DefectDistribution";

function App() {
  const [inspections, setInspections] = useState([]);
  const [refreshVideos, setRefreshVideos] = useState(false);

  // Function to handle new inspection data
  const addInspection = (bottleId, time, defect) => {
    setInspections((prevInspections) => [
      { bottle: `Bottle #${bottleId}`, time, defect: defect || "No defect" },
      ...prevInspections,
    ]);
  };

  // Function to refresh recorded videos
  const handleRecordingStop = () => {
    setRefreshVideos((prev) => !prev); // Toggle state to trigger refresh
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        
        {/* Dashboard Section */}
        <Dashboard />

        {/* Live Feed and Defect Analysis */}
        <div className="live-section-container">
          <LiveFeed addInspection={addInspection} onStopRecording={handleRecordingStop} />
          <div className="live-section-cont1">
            <RecentInspection inspections={inspections} />
            <DefectDistribution />
          </div>
        </div>

        {/* Recorded Video History Section */}
        <div className="video-history">
          <RecordedHistory refreshVideos={refreshVideos} />
        </div>
      </div>
    </div>
  );
}

export default App;
