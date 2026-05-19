// import { useState } from "react";
// import { getExamPaperVaultContract } from "../utils/contracts";

// function ApprovePaper() {
//   const [paperId, setPaperId] = useState("1");
//   const [paper, setPaper] = useState(null);
//   const [activeAction, setActiveAction] = useState("");
//   const [message, setMessage] = useState("");

//   function getErrorMessage(error) {
//     return (
//       error?.reason ||
//       error?.shortMessage ||
//       error?.info?.error?.message ||
//       error?.message ||
//       "Transaction failed."
//     );
//   }

//   function formatPaper(data) {
//     return {
//       id: data.id.toString(),
//       courseCode: data.courseCode,
//       examTitle: data.examTitle,
//       paperHash: data.paperHash,
//       encryptedFileReference: data.encryptedFileReference,
//       professor: data.professor,
//       examStartTime: data.examStartTime.toString(),
//       requiredApprovals: data.requiredApprovals.toString(),
//       approvalCount: data.approvalCount.toString(),
//       isLocked: data.isLocked,
//       isKeyReleased: data.isKeyReleased,
//       isCompromised: data.isCompromised,
//     };
//   }

//   async function loadPaper() {
//     try {
//       setActiveAction("load");
//       setMessage("");

//       const contract = await getExamPaperVaultContract();
//       const data = await contract.papers(paperId);

//       if (data.id.toString() === "0") {
//         setPaper(null);
//         setMessage("Paper not found.");
//         return;
//       }

//       setPaper(formatPaper(data));
//       setMessage("Paper loaded successfully.");
//     } catch (error) {
//       setMessage(getErrorMessage(error));
//     } finally {
//       setActiveAction("");
//     }
//   }

//   async function approvePaper() {
//     try {
//       setActiveAction("approve");
//       setMessage("");

//       const contract = await getExamPaperVaultContract();
//       const tx = await contract.approvePaper(paperId);

//       setMessage(`Approval transaction submitted. Hash: ${tx.hash}`);

//       // For now, do not depend too much on tx.wait because Sepolia RPC is slow.
//       setTimeout(async () => {
//         setActiveAction("");
//         setMessage("If MetaMask shows confirmed, approval is done. Reload paper status.");
//       }, 3000);
//     } catch (error) {
//       setMessage(getErrorMessage(error));
//       setActiveAction("");
//     }
//   }

//   return (
//     <section className="action-panel">
//       <div className="panel-heading">
//         <span>Department Head Controls</span>
//         <h2 style={{color:"white"}}>Approve Exam Paper</h2>
//         <p>
//           Load a submitted paper by ID and approve it. Once required approvals
//           are reached, the paper becomes locked.
//         </p>
//       </div>

//       <div className="single-form">
//         <div className="form-card wide-card">
//           <h3>Load Paper</h3>

//           <label>Paper ID</label>
//           <input
//             type="number"
//             min="1"
//             value={paperId}
//             onChange={(e) => setPaperId(e.target.value)}
//           />

//           <button onClick={loadPaper} disabled={activeAction === "load"}>
//             {activeAction === "load" ? "Loading..." : "Load Paper"}
//           </button>

//           {paper && (
//             <div className="paper-box">
//               <h3>
//                 {paper.courseCode} - {paper.examTitle}
//               </h3>

//               <p><strong>Paper ID:</strong> {paper.id}</p>
//               <p><strong>Professor:</strong> {paper.professor}</p>
//               <p><strong>Hash:</strong> {paper.paperHash}</p>
//               <p><strong>File Reference:</strong> {paper.encryptedFileReference}</p>
//               <p>
//                 <strong>Approvals:</strong> {paper.approvalCount} / {paper.requiredApprovals}
//               </p>
//               <p><strong>Locked:</strong> {paper.isLocked ? "Yes" : "No"}</p>
//               <p><strong>Compromised:</strong> {paper.isCompromised ? "Yes" : "No"}</p>

//               <button
//                 onClick={approvePaper}
//                 disabled={activeAction === "approve" || paper.isLocked}
//               >
//                 {paper.isLocked
//                   ? "Paper Already Locked"
//                   : activeAction === "approve"
//                   ? "Approving..."
//                   : "Approve Paper"}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {activeAction && (
//         <div className="notice pending">
//           Processing. Confirm MetaMask if prompted.
//         </div>
//       )}

//       {message && <div className="notice">{message}</div>}
//     </section>
//   );
// }

// export default ApprovePaper;






import { useEffect, useState } from "react";
import { getExamPaperVaultContract } from "../utils/contracts";

function ApprovePaper() {
  const [paperId, setPaperId] = useState("1");
  const [paper, setPaper] = useState(null);
  const [papers, setPapers] = useState([]);
  const [activeAction, setActiveAction] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAllPapers();
  }, []);

  function getErrorMessage(error) {
    return (
      error?.reason ||
      error?.shortMessage ||
      error?.info?.error?.message ||
      error?.message ||
      "Transaction failed."
    );
  }

  function formatPaper(data) {
    return {
      id: data.id.toString(),
      courseCode: data.courseCode,
      examTitle: data.examTitle,
      paperHash: data.paperHash,
      encryptedFileReference: data.encryptedFileReference,
      professor: data.professor,
      examStartTime: data.examStartTime.toString(),
      requiredApprovals: data.requiredApprovals.toString(),
      approvalCount: data.approvalCount.toString(),
      isLocked: data.isLocked,
      isKeyReleased: data.isKeyReleased,
      isCompromised: data.isCompromised,
    };
  }

  async function loadAllPapers() {
    try {
      setActiveAction("loadPapers");
      setMessage("");

      const contract = await getExamPaperVaultContract();
      const count = await contract.paperCount();

      const loadedPapers = [];

      for (let i = 1; i <= Number(count); i++) {
        const data = await contract.papers(i);

        if (data.id.toString() !== "0") {
          loadedPapers.push(formatPaper(data));
        }
      }

      setPapers(loadedPapers);

      if (loadedPapers.length > 0) {
        setPaperId(loadedPapers[loadedPapers.length - 1].id);
      }

      setMessage(
        loadedPapers.length > 0
          ? "Papers loaded successfully."
          : "No papers found yet."
      );
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setActiveAction("");
    }
  }

  async function loadPaper(selectedPaperId = paperId) {
    try {
      setActiveAction("load");
      setMessage("");

      const contract = await getExamPaperVaultContract();
      const data = await contract.papers(selectedPaperId);

      if (data.id.toString() === "0") {
        setPaper(null);
        setMessage("Paper not found.");
        return;
      }

      setPaper(formatPaper(data));
      setMessage("Paper loaded successfully.");
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setActiveAction("");
    }
  }

  async function approvePaper() {
    try {
      setActiveAction("approve");
      setMessage("");

      const contract = await getExamPaperVaultContract();
      const tx = await contract.approvePaper(paperId);

      setMessage(`Approval transaction submitted. Hash: ${tx.hash}`);

      setTimeout(async () => {
        setActiveAction("");
        setMessage("If MetaMask shows confirmed, approval is done. Reload paper status.");
        await loadPaper(paperId);
        await loadAllPapers();
      }, 3000);
    } catch (error) {
      setMessage(getErrorMessage(error));
      setActiveAction("");
    }
  }

  return (
    <section className="action-panel">
      <div className="panel-heading">
        <span>Department Head Controls</span>
        <h2 style={{ color: "white" }}>Approve Exam Paper</h2>
        <p>
          Load a submitted paper by ID and approve it. Once required approvals
          are reached, the paper becomes locked.
        </p>
      </div>

      <div className="single-form">
        <div className="form-card wide-card">
          <h3>Load Paper</h3>

          <button
            onClick={loadAllPapers}
            disabled={activeAction === "loadPapers"}
            style={{ marginBottom: "12px" }}
          >
            {activeAction === "loadPapers" ? "Refreshing..." : "Refresh Paper List"}
          </button>

          <label>Select Paper</label>
          <select
            value={paperId}
            onChange={(e) => {
              setPaperId(e.target.value);
              setPaper(null);
            }}
            style={{
              width: "100%",
              padding: "13px 14px",
              marginBottom: "12px",
              borderRadius: "14px",
              border: "1px solid rgba(255, 255, 255, 0.14)",
              background: "rgba(255, 255, 255, 0.075)",
              color: "#fff",
              outline: "none",
            }}
          >
            {papers.length === 0 ? (
              <option value="1">No papers loaded</option>
            ) : (
              papers.map((item) => (
                <option key={item.id} value={item.id} style={{ color: "#000" }}>
                  #{item.id} - {item.courseCode} - {item.examTitle} - {item.approvalCount}/{item.requiredApprovals} approvals
                </option>
              ))
            )}
          </select>

          <label>Paper ID</label>
          <input
            type="number"
            min="1"
            value={paperId}
            onChange={(e) => setPaperId(e.target.value)}
          />

          <button onClick={() => loadPaper()} disabled={activeAction === "load"}>
            {activeAction === "load" ? "Loading..." : "Load Paper"}
          </button>

          {paper && (
            <div className="paper-box">
              <h3>
                {paper.courseCode} - {paper.examTitle}
              </h3>

              <p><strong>Paper ID:</strong> {paper.id}</p>
              <p><strong>Professor:</strong> {paper.professor}</p>
              <p><strong>Hash:</strong> {paper.paperHash}</p>
              <p><strong>File Reference:</strong> {paper.encryptedFileReference}</p>
              <p>
                <strong>Approvals:</strong> {paper.approvalCount} / {paper.requiredApprovals}
              </p>
              <p><strong>Locked:</strong> {paper.isLocked ? "Yes" : "No"}</p>
              <p><strong>Compromised:</strong> {paper.isCompromised ? "Yes" : "No"}</p>

              <button
                onClick={approvePaper}
                disabled={activeAction === "approve" || paper.isLocked}
              >
                {paper.isLocked
                  ? "Paper Already Locked"
                  : activeAction === "approve"
                  ? "Approving..."
                  : "Approve Paper"}
              </button>
            </div>
          )}
        </div>
      </div>

      {activeAction && (
        <div className="notice pending">
          Processing. Confirm MetaMask if prompted.
        </div>
      )}

      {message && <div className="notice">{message}</div>}
    </section>
  );
}

export default ApprovePaper;