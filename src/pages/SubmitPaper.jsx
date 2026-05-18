import { useState } from "react";
import { getExamPaperVaultContract } from "../utils/contracts";
import {
  generateFileHash,
  generateSimulatedFileReference,
} from "../utils/fileHash";

function SubmitPaper() {
  const [courseCode, setCourseCode] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [paperHash, setPaperHash] = useState("");
  const [fileReference, setFileReference] = useState("");
  const [examStartTime, setExamStartTime] = useState("");
  const [requiredApprovals, setRequiredApprovals] = useState("2");

  const [selectedFileName, setSelectedFileName] = useState("");
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

  async function handleFileUpload(event) {
    try {
      const file = event.target.files[0];

      if (!file) return;

      setActiveAction("hashing");
      setMessage("Generating SHA-256 hash from selected file...");

      const hash = await generateFileHash(file);
      const reference = generateSimulatedFileReference(hash);

      setSelectedFileName(file.name);
      setPaperHash(hash);
      setFileReference(reference);

      setMessage("File hash and simulated storage reference generated.");
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setActiveAction("");
    }
  }

//   async function submitPaper() {
//     try {
//       setActiveAction("submit");
//       setMessage("");

//       if (!courseCode || !examTitle || !paperHash || !fileReference || !examStartTime) {
//         setMessage("Please fill all required fields and upload a paper file.");
//         return;
//       }

//       const unixExamTime = Math.floor(new Date(examStartTime).getTime() / 1000);

//       if (unixExamTime <= Math.floor(Date.now() / 1000)) {
//         setMessage("Exam start time must be in the future.");
//         return;
//       }

//       const contract = await getExamPaperVaultContract();

//       const tx = await contract.submitPaper(
//         courseCode,
//         examTitle,
//         paperHash,
//         fileReference,
//         unixExamTime,
//         requiredApprovals
//       );

//       setMessage(`Transaction submitted. Hash: ${tx.hash}`);

//       const receipt = await tx.wait(1);

//       if (receipt.status === 1) {
//         setMessage("Paper submitted successfully on-chain.");

//         setCourseCode("");
//         setExamTitle("");
//         setPaperHash("");
//         setFileReference("");
//         setExamStartTime("");
//         setRequiredApprovals("2");
//         setSelectedFileName("");
//       } else {
//         setMessage("Transaction failed on-chain.");
//       }
//     } catch (error) {
//       setMessage(getErrorMessage(error));
//     } finally {
//       setActiveAction("");
//     }
//   }


async function submitPaper() {
  try {
    setActiveAction("submit");
    setMessage("");

    if (!courseCode || !examTitle || !paperHash || !fileReference || !examStartTime) {
      setMessage("Please fill all required fields and upload a paper file.");
      setActiveAction("");
      return;
    }

    const unixExamTime = Math.floor(new Date(examStartTime).getTime() / 1000);

    if (unixExamTime <= Math.floor(Date.now() / 1000)) {
      setMessage("Exam start time must be in the future.");
      setActiveAction("");
      return;
    }

    const contract = await getExamPaperVaultContract();

    const tx = await contract.submitPaper(
      courseCode,
      examTitle,
      paperHash,
      fileReference,
      unixExamTime,
      requiredApprovals
    );

    setMessage(`Transaction submitted. Hash: ${tx.hash}`);

    setTimeout(() => {
      setMessage(
        "Paper submission completed. If MetaMask shows confirmed, the paper is stored on-chain."
      );

      setCourseCode("");
      setExamTitle("");
      setPaperHash("");
      setFileReference("");
      setExamStartTime("");
      setRequiredApprovals("2");
      setSelectedFileName("");
      setActiveAction("");
    }, 3000);
  } catch (error) {
    setMessage(getErrorMessage(error));
    setActiveAction("");
  }
}
  return (
    <section className="action-panel">
      <div className="panel-heading">
        <span>Professor Controls</span>
        <h2 style={{color:"white"}}>Submit Exam Paper</h2>
        <p>
          Upload a paper file, generate its SHA-256 hash, create a simulated
          off-chain reference, and store the integrity proof on-chain.
        </p>
      </div>

      <div className="single-form">
        <div className="form-card wide-card">
          <h3>Paper Information</h3>
          <p>
            The actual paper file is not stored on-chain. Only the hash and
            simulated encrypted file reference are submitted to the smart contract.
          </p>

          <label>Course Code</label>
          <input
            type="text"
            placeholder="Example: CS301"
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
          />

          <label>Exam Title</label>
          <input
            type="text"
            placeholder="Example: Midterm Exam"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
          />

          <label>Upload Exam Paper</label>
          <input type="file" onChange={handleFileUpload} />

          {selectedFileName && (
            <div className="mini-info">
              Selected File: <strong>{selectedFileName}</strong>
            </div>
          )}

          <label>Generated SHA-256 Hash</label>
          <textarea value={paperHash} readOnly placeholder="Hash will appear here after file upload" />

          <label>Simulated Encrypted File Reference</label>
          <input
            type="text"
            value={fileReference}
            readOnly
            placeholder="Reference will appear here after file upload"
          />

          <label>Exam Start Date & Time</label>
          <input
            type="datetime-local"
            value={examStartTime}
            onChange={(e) => setExamStartTime(e.target.value)}
          />

          <label>Required Department Head Approvals</label>
          <input
            type="number"
            min="1"
            value={requiredApprovals}
            onChange={(e) => setRequiredApprovals(e.target.value)}
          />

          <button
            onClick={submitPaper}
            disabled={activeAction === "submit" || activeAction === "hashing"}
          >
            {activeAction === "submit"
              ? "Submitting..."
              : activeAction === "hashing"
              ? "Generating Hash..."
              : "Submit Paper"}
          </button>
        </div>
      </div>

      {activeAction && (
        <div className="notice pending">
          Processing. Please wait and confirm MetaMask if prompted.
        </div>
      )}

      {message && <div className="notice">{message}</div>}
    </section>
  );
}

export default SubmitPaper;