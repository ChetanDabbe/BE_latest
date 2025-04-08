// import React from "react";
// import "../styles/recentInspection.css";

// function RecentInspection() {
//   const inspections = [
//     { bottle: "Bottle #1", time: "14:32:05", defect: "Crack" },
//     { bottle: "Bottle #2", time: "14:32:01", defect: "Crack detected" },
//     { bottle: "Bottle #3", time: "14:31:57", defect: "Scratch" },
//     { bottle: "Bottle #4", time: "14:31:53", defect: "Deformation detected" },
//     { bottle: "Bottle #5", time: "14:31:49", defect: null },
//   ];

//   return (
//     <div className="recent-inspection-card">
//       <h4 className="recent-title">Recent Inspections</h4>
//       <div className="inspection-list">
//         {inspections.map((item, index) => (
//           <div key={index} className="inspection-row">
//             <span className="dot">●</span>
//             <span className="bottle">{item.bottle}</span>
//             <span className="time">{item.time}</span>
//             <span className={`defect ${item.defect ? "defect-text" : "no-defect"}`}>
//               {item.defect ? item.defect : "No defect"}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default RecentInspection;


import React from "react";
import "../styles/recentInspection.css";

function RecentInspection({ inspections }) {
  return (
    <div className="recent-inspection-card">
      <h4 className="recent-title">Recent Inspections</h4>
      <div className="inspection-list">
        {inspections.map((item, index) => (
          <div key={index} className="inspection-row">
            <span className="dot">●</span>
            <span className="bottle">{item.bottle}</span>
            <span className="time">{item.time}</span>
            <span className={`defect ${item.defect && item.defect !== "No defect" ? "defect-text" : "no-defect"}`}>
              {item.defect && item.defect !== "No defect" ? item.defect : "No defect"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentInspection;
