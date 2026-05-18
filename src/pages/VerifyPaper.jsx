import { useState } from "react";
import { getExamPaperVaultContract } from "../utils/contracts";
import { generateFileHash } from "../utils/fileHash";

function VerifyPaper() {
  const [paperId, setPaperId] = useState("1");
  const [hashToCheck, setHashToCheck] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [result, setResult] = useState(null);
  const [activeAction, setActiveAction] = useState("");
  const [message, setMessage] = useState("");

  function getErrorMessage(error) {
    return (
      error?.reason ||
      error?.shortMessage ||
      error?.info?.error?.message ||
      error?.message ||
      "Verification failed."
    );
  }

  async function handleFileUpload(event) {
    try {
      const file = event.target.files[0];
      if (!file) return;

      setActiveAction("hashing");
      setMessage("Generating SHA-256 hash from selected file...");
      setResult(null);

      const hash = await generateFileHash(file);

      setSelectedFileName(file.name);
      setHashToCheck(hash);
      setMessage("Hash generated. You can now verify it against the blockchain.");
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setActiveAction("");
    }
  }

  async function verifyPaper() {
    try {
      setActiveAction("verify");
      setMessage("");
      setResult(null);

      if (!paperId || !hashToCheck) {
        setMessage("Please enter paper ID and hash, or upload a file.");
        return;
      }

      const contract = await getExamPaperVaultContract();

      const isValid = await contract.verifyPaper.staticCall(
        paperId,
        hashToCheck
      );

      setResult(isValid);

      if (isValid) {
        setMessage("Verification successful. The paper matches the on-chain hash.");
      } else {
        setMessage("Verification failed. The paper/hash does not match the on-chain record.");
      }
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setActiveAction("");
    }
  }

  return (
    <section className="action-panel">
      <div className="panel-heading">
        <span>Public Verification</span>
        <h2 style={{color:"white"}}>Verify Exam Paper</h2>
        <p>
          Upload a paper file or paste its hash to compare it with the original
          hash stored on-chain.
        </p>
      </div>

      <div className="single-form">
        <div className="form-card wide-card">
          <h3>Paper Verification</h3>
          <p>
            If the generated hash matches the stored blockchain hash, the paper
            has not been altered.
          </p>

          <label>Paper ID</label>
          <input
            type="number"
            min="1"
            value={paperId}
            onChange={(e) => setPaperId(e.target.value)}
          />

          <label>Upload Paper File</label>
          <input type="file" onChange={handleFileUpload} />

          {selectedFileName && (
            <div className="mini-info">
              Selected File: <strong>{selectedFileName}</strong>
            </div>
          )}

          <label>Hash to Verify</label>
          <textarea
            value={hashToCheck}
            onChange={(e) => setHashToCheck(e.target.value)}
            placeholder="Upload file to generate hash, or paste hash manually"
          />

          <button
            onClick={verifyPaper}
            disabled={activeAction === "verify" || activeAction === "hashing"}
          >
            {activeAction === "verify"
              ? "Verifying..."
              : activeAction === "hashing"
              ? "Generating Hash..."
              : "Verify Paper"}
          </button>

          {result !== null && (
            <div className={result ? "result-box success" : "result-box danger"}>
              {result ? "✅ Valid Paper" : "❌ Invalid / Modified Paper"}
            </div>
          )}
        </div>
      </div>

      {activeAction && (
        <div className="notice pending">
          Processing. Please wait.
        </div>
      )}

      {message && <div className="notice">{message}</div>}
    </section>
  );
}

export default VerifyPaper;