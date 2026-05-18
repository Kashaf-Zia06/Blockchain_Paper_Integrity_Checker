import { useState } from "react";
import { getExamPaperVaultContract } from "../utils/contracts";

function ReleaseKey() {
  const [paperId, setPaperId] = useState("1");
  const [decryptionKey, setDecryptionKey] = useState("");
  const [releasedKey, setReleasedKey] = useState("");
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
      professor: data.professor,
      examStartTime: Number(data.examStartTime),
      requiredApprovals: data.requiredApprovals.toString(),
      approvalCount: data.approvalCount.toString(),
      isLocked: data.isLocked,
      isKeyReleased: data.isKeyReleased,
      isCompromised: data.isCompromised,
    };
  }

  function formatDate(timestamp) {
    if (!timestamp) return "-";
    return new Date(timestamp * 1000).toLocaleString();
  }

  function getCurrentUnixTime() {
    return Math.floor(Date.now() / 1000);
  }

  async function loadPaper() {
    try {
      setActiveAction("load");
      setMessage("");
      setReleasedKey("");

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

  async function releaseKey() {
    try {
      setActiveAction("release");
      setMessage("");

      if (!paperId || !decryptionKey) {
        setMessage("Please enter paper ID and decryption key.");
        setActiveAction("");
        return;
      }

      const contract = await getExamPaperVaultContract();

      const tx = await contract.releaseKey(paperId, decryptionKey);

      setMessage(`Release key transaction submitted. Hash: ${tx.hash}`);

      setTimeout(() => {
        setMessage(
          "If MetaMask shows confirmed, the decryption key has been released on-chain."
        );
        setActiveAction("");
      }, 3000);
    } catch (error) {
      setMessage(getErrorMessage(error));
      setActiveAction("");
    }
  }

  async function loadReleasedKey() {
    try {
      setActiveAction("readKey");
      setMessage("");

      const contract = await getExamPaperVaultContract();
      const key = await contract.decryptionKeys(paperId);

      if (!key) {
        setReleasedKey("");
        setMessage("No decryption key released for this paper yet.");
        return;
      }

      setReleasedKey(key);
      setMessage("Released key loaded successfully.");
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setActiveAction("");
    }
  }

  return (
    <section className="action-panel">
      <div className="panel-heading">
        <span>Professor Controls</span>
        <h2 style={{ color: "white" }}>Release Decryption Key</h2>
        <p>
          Release the decryption key only after the exam start time. The smart
          contract rejects early release attempts automatically.
        </p>
      </div>

      <div className="single-form">
        <div className="form-card wide-card">
          <h3>Time-Locked Key Release</h3>
          <p>
            This demonstrates that the professor cannot reveal the key before the
            official exam time stored on-chain.
          </p>

          <label>Paper ID</label>
          <input
            type="number"
            min="1"
            value={paperId}
            onChange={(e) => setPaperId(e.target.value)}
          />

          <button onClick={loadPaper} disabled={activeAction === "load"}>
            {activeAction === "load" ? "Loading..." : "Load Paper Status"}
          </button>

          {paper && (
            <div className="paper-box">
              <h3>
                {paper.courseCode} - {paper.examTitle}
              </h3>

              <p>
                <strong>Paper ID:</strong> {paper.id}
              </p>

              <p>
                <strong>Professor:</strong> {paper.professor}
              </p>

              <p>
                <strong>Exam Start Time:</strong>{" "}
                {formatDate(paper.examStartTime)}
              </p>

              <p>
                <strong>Current Time:</strong>{" "}
                {formatDate(getCurrentUnixTime())}
              </p>

              <p>
                <strong>Approvals:</strong> {paper.approvalCount} /{" "}
                {paper.requiredApprovals}
              </p>

              <p>
                <strong>Locked:</strong> {paper.isLocked ? "Yes" : "No"}
              </p>

              <p>
                <strong>Key Released:</strong>{" "}
                {paper.isKeyReleased ? "Yes" : "No"}
              </p>

              <p>
                <strong>Time Lock Status:</strong>{" "}
                {getCurrentUnixTime() >= paper.examStartTime
                  ? "Exam time reached — key can be released"
                  : "Exam time not reached — release should fail"}
              </p>
            </div>
          )}

          <label>Decryption Key</label>
          <input
            type="text"
            placeholder="Example: CS301-SECRET-KEY"
            value={decryptionKey}
            onChange={(e) => setDecryptionKey(e.target.value)}
          />

          <button
            onClick={releaseKey}
            disabled={activeAction === "release" || !paperId || !decryptionKey}
          >
            {activeAction === "release" ? "Releasing..." : "Release Key"}
          </button>

          <button
            onClick={loadReleasedKey}
            disabled={activeAction === "readKey" || !paperId}
            className="execute-button"
            style={{ marginTop: "10px" }}
          >
            {activeAction === "readKey"
              ? "Loading Key..."
              : "Load Released Key"}
          </button>

          {releasedKey && (
            <div className="mini-info">
              Released Decryption Key: <strong>{releasedKey}</strong>
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

export default ReleaseKey;