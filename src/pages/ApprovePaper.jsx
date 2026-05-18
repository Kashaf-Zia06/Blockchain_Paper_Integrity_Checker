import { useState } from "react";
import { getExamPaperVaultContract } from "../utils/contracts";

function ApprovePaper() {
  const [paperId, setPaperId] = useState("1");
  const [paper, setPaper] = useState(null);
  const [activeAction, setActiveAction] = useState("");
  const [message, setMessage] = useState("");

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

  async function loadPaper() {
    try {
      setActiveAction("load");
      setMessage("");

      const contract = await getExamPaperVaultContract();
      const data = await contract.papers(paperId);

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

      // For now, do not depend too much on tx.wait because Sepolia RPC is slow.
      setTimeout(async () => {
        setActiveAction("");
        setMessage("If MetaMask shows confirmed, approval is done. Reload paper status.");
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
        <h2 style={{color:"white"}}>Approve Exam Paper</h2>
        <p>
          Load a submitted paper by ID and approve it. Once required approvals
          are reached, the paper becomes locked.
        </p>
      </div>

      <div className="single-form">
        <div className="form-card wide-card">
          <h3>Load Paper</h3>

          <label>Paper ID</label>
          <input
            type="number"
            min="1"
            value={paperId}
            onChange={(e) => setPaperId(e.target.value)}
          />

          <button onClick={loadPaper} disabled={activeAction === "load"}>
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