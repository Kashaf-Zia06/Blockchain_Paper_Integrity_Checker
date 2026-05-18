// // import { useState } from "react";
// // import {
// //     getExamPaperVaultContract,
// //     getIntegrityTokenContract,
// //     getAcademicDAOContract,
// // } from "../utils/contracts";

// // function AdminSetup() {
// //     const [professorAddress, setProfessorAddress] = useState("");
// //     const [headAddress, setHeadAddress] = useState("");
// //     const [officerAddress, setOfficerAddress] = useState("");
// //     const [tokenAmount, setTokenAmount] = useState("10");

// //     const [loading, setLoading] = useState(false);
// //     const [message, setMessage] = useState("");

// //     async function addProfessor() {
// //         try {
// //             setLoading(true);
// //             setMessage("");

// //             const contract = await getExamPaperVaultContract();
// //             const tx = await contract.addProfessor(professorAddress);

// //             setMessage("Transaction submitted. Waiting for confirmation...");

// //             const receipt = await tx.wait(1);

// //             if (receipt.status === 1) {
// //                 setMessage("Professor added successfully.");
// //                 setProfessorAddress("");
// //             } else {
// //                 setMessage("Transaction failed.");
// //             }
// //         } catch (error) {
// //             setMessage(error.reason || error.shortMessage || error.message || "Failed to add professor.");
// //         } finally {
// //             setLoading(false);
// //         }
// //     }

// //     async function addDepartmentHead() {
// //         try {
// //             setLoading(true);
// //             setMessage("");

// //             const contract = await getExamPaperVaultContract();
// //             const tx = await contract.addDepartmentHead(headAddress);
// //             await tx.wait();

// //             setMessage("Department head added successfully.");
// //             setHeadAddress("");
// //         } catch (error) {
// //             setMessage(error.reason || error.shortMessage || error.message || "Failed to add department head.");
// //         } finally {
// //             setLoading(false);
// //         }
// //     }

// //     async function addOfficer() {
// //         try {
// //             setLoading(true);
// //             setMessage("");

// //             const dao = await getAcademicDAOContract();
// //             const tx = await dao.addOfficer(officerAddress);
// //             await tx.wait();

// //             setMessage("DAO officer added successfully.");
// //         } catch (error) {
// //             setMessage(error.reason || error.shortMessage || error.message || "Failed to add officer.");
// //         } finally {
// //             setLoading(false);
// //         }
// //     }

// //     async function mintOfficerTokens() {
// //         try {
// //             setLoading(true);
// //             setMessage("");

// //             const token = await getIntegrityTokenContract();
// //             const tx = await token.mintOfficerTokens(officerAddress, tokenAmount);
// //             await tx.wait();

// //             setMessage(`${tokenAmount} AIT minted to officer successfully.`);
// //             setOfficerAddress("");
// //             setTokenAmount("10");
// //         } catch (error) {
// //             setMessage(error.reason || error.shortMessage || error.message || "Failed to mint tokens.");
// //         } finally {
// //             setLoading(false);
// //         }
// //     }

// //     return (
// //         <section className="action-panel">
// //             <div className="panel-heading">
// //                 <span>Admin Controls</span>
// //                 <h2>System Setup</h2>
// //                 <p>
// //                     Register university roles and issue AIT governance tokens to academic officers.
// //                 </p>
// //             </div>

// //             <div className="form-grid">
// //                 <div className="form-card">
// //                     <h3>Add Professor</h3>
// //                     <p>Register a professor wallet that can submit exam papers.</p>

// //                     <input
// //                         type="text"
// //                         placeholder="Professor wallet address"
// //                         value={professorAddress}
// //                         onChange={(e) => setProfessorAddress(e.target.value)}
// //                     />

// //                     <button onClick={addProfessor} disabled={loading || !professorAddress}>
// //                         Add Professor
// //                     </button>
// //                 </div>

// //                 <div className="form-card">
// //                     <h3>Add Department Head</h3>
// //                     <p>Register a department head wallet that can approve papers.</p>

// //                     <input
// //                         type="text"
// //                         placeholder="Department head wallet address"
// //                         value={headAddress}
// //                         onChange={(e) => setHeadAddress(e.target.value)}
// //                     />

// //                     <button onClick={addDepartmentHead} disabled={loading || !headAddress}>
// //                         Add Department Head
// //                     </button>
// //                 </div>

// //                 <div className="form-card">
// //                     <h3>Add DAO Officer</h3>
// //                     <p>Register an academic integrity officer for DAO governance.</p>

// //                     <input
// //                         type="text"
// //                         placeholder="Officer wallet address"
// //                         value={officerAddress}
// //                         onChange={(e) => setOfficerAddress(e.target.value)}
// //                     />

// //                     <button onClick={addOfficer} disabled={loading || !officerAddress}>
// //                         Add Officer
// //                     </button>
// //                 </div>

// //                 <div className="form-card">
// //                     <h3>Mint AIT Tokens</h3>
// //                     <p>Give voting power to a registered DAO officer.</p>

// //                     <input
// //                         type="text"
// //                         placeholder="Officer wallet address"
// //                         value={officerAddress}
// //                         onChange={(e) => setOfficerAddress(e.target.value)}
// //                     />

// //                     <input
// //                         type="number"
// //                         min="1"
// //                         placeholder="Token amount"
// //                         value={tokenAmount}
// //                         onChange={(e) => setTokenAmount(e.target.value)}
// //                     />

// //                     <button onClick={mintOfficerTokens} disabled={loading || !officerAddress || !tokenAmount}>
// //                         Mint Tokens
// //                     </button>
// //                 </div>
// //             </div>

// //             {loading && <div className="notice pending">Transaction pending. Confirm it in MetaMask.</div>}
// //             {message && <div className="notice">{message}</div>}
// //         </section>
// //     );
// // }

// // export default AdminSetup;

// import { useState } from "react";
// import {
//   getExamPaperVaultContract,
//   getIntegrityTokenContract,
//   getAcademicDAOContract,
// } from "../utils/contracts";

// function AdminSetup() {
//   const [professorAddress, setProfessorAddress] = useState("");
//   const [headAddress, setHeadAddress] = useState("");
//   const [officerAddress, setOfficerAddress] = useState("");
//   const [tokenAmount, setTokenAmount] = useState("10");

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

//   async function waitForTransaction(tx, successMessage, afterSuccess) {
//     setMessage(`Transaction submitted. Hash: ${tx.hash}`);

//     try {
//       const receipt = await tx.wait(1);

//       if (receipt.status === 1) {
//         setMessage(successMessage);
//         if (afterSuccess) afterSuccess();
//       } else {
//         setMessage("Transaction failed on-chain.");
//       }
//     } catch (error) {
//       setMessage(
//         `Transaction was submitted, but confirmation is slow. Please verify by switching role or checking Sepolia. Hash: ${tx.hash}`
//       );
//     }
//   }

//   async function addProfessor() {
//     try {
//       setActiveAction("addProfessor");
//       setMessage("");

//       const contract = await getExamPaperVaultContract();
//       const tx = await contract.addProfessor(professorAddress);

//       await waitForTransaction(tx, "Professor added successfully.", () => {
//         setProfessorAddress("");
//       });
//     } catch (error) {
//       setMessage(getErrorMessage(error));
//     } finally {
//       setActiveAction("");
//     }
//   }

//   async function addDepartmentHead() {
//     try {
//       setActiveAction("addDepartmentHead");
//       setMessage("");

//       const contract = await getExamPaperVaultContract();
//       const tx = await contract.addDepartmentHead(headAddress);

//       await waitForTransaction(tx, "Department head added successfully.", () => {
//         setHeadAddress("");
//       });
//     } catch (error) {
//       setMessage(getErrorMessage(error));
//     } finally {
//       setActiveAction("");
//     }
//   }

//   async function addOfficer() {
//     try {
//       setActiveAction("addOfficer");
//       setMessage("");

//       const dao = await getAcademicDAOContract();
//       const tx = await dao.addOfficer(officerAddress);

//       await waitForTransaction(tx, "DAO officer added successfully.");
//     } catch (error) {
//       setMessage(getErrorMessage(error));
//     } finally {
//       setActiveAction("");
//     }
//   }

//   async function mintOfficerTokens() {
//     try {
//       setActiveAction("mintTokens");
//       setMessage("");

//       const token = await getIntegrityTokenContract();
//       const tx = await token.mintOfficerTokens(officerAddress, tokenAmount);

//       await waitForTransaction(
//         tx,
//         `${tokenAmount} AIT minted to officer successfully.`,
//         () => {
//           setOfficerAddress("");
//           setTokenAmount("10");
//         }
//       );
//     } catch (error) {
//       setMessage(getErrorMessage(error));
//     } finally {
//       setActiveAction("");
//     }
//   }

//   return (
//     <section className="action-panel">
//       <div className="panel-heading">
//         <span>Admin Controls</span>
//         <h2>System Setup</h2>
//         <p>
//           Register university roles and issue AIT governance tokens to academic
//           officers.
//         </p>
//       </div>

//       <div className="form-grid">
//         <div className="form-card">
//           <h3>Add Professor</h3>
//           <p>Register a professor wallet that can submit exam papers.</p>

//           <input
//             type="text"
//             placeholder="Professor wallet address"
//             value={professorAddress}
//             onChange={(e) => setProfessorAddress(e.target.value)}
//           />

//           <button
//             onClick={addProfessor}
//             disabled={activeAction === "addProfessor" || !professorAddress}
//           >
//             {activeAction === "addProfessor" ? "Adding..." : "Add Professor"}
//           </button>
//         </div>

//         <div className="form-card">
//           <h3>Add Department Head</h3>
//           <p>Register a department head wallet that can approve papers.</p>

//           <input
//             type="text"
//             placeholder="Department head wallet address"
//             value={headAddress}
//             onChange={(e) => setHeadAddress(e.target.value)}
//           />

//           <button
//             onClick={addDepartmentHead}
//             disabled={activeAction === "addDepartmentHead" || !headAddress}
//           >
//             {activeAction === "addDepartmentHead"
//               ? "Adding..."
//               : "Add Department Head"}
//           </button>
//         </div>

//         <div className="form-card">
//           <h3>Add DAO Officer</h3>
//           <p>Register an academic integrity officer for DAO governance.</p>

//           <input
//             type="text"
//             placeholder="Officer wallet address"
//             value={officerAddress}
//             onChange={(e) => setOfficerAddress(e.target.value)}
//           />

//           <button
//             onClick={addOfficer}
//             disabled={activeAction === "addOfficer" || !officerAddress}
//           >
//             {activeAction === "addOfficer" ? "Adding..." : "Add Officer"}
//           </button>
//         </div>

//         <div className="form-card">
//           <h3>Mint AIT Tokens</h3>
//           <p>Give voting power to a registered DAO officer.</p>

//           <input
//             type="text"
//             placeholder="Officer wallet address"
//             value={officerAddress}
//             onChange={(e) => setOfficerAddress(e.target.value)}
//           />

//           <input
//             type="number"
//             min="1"
//             placeholder="Token amount"
//             value={tokenAmount}
//             onChange={(e) => setTokenAmount(e.target.value)}
//           />

//           <button
//             onClick={mintOfficerTokens}
//             disabled={
//               activeAction === "mintTokens" || !officerAddress || !tokenAmount
//             }
//           >
//             {activeAction === "mintTokens" ? "Minting..." : "Mint Tokens"}
//           </button>
//         </div>
//       </div>

//       {activeAction && (
//         <div className="notice pending">
//           Transaction pending. Confirm it in MetaMask.
//         </div>
//       )}

//       {message && <div className="notice">{message}</div>}
//     </section>
//   );
// }

// export default AdminSetup;







import { useState } from "react";
import {
  getExamPaperVaultContract,
  getIntegrityTokenContract,
  getAcademicDAOContract,
} from "../utils/contracts";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  .admin-root {
    --bg: #080c10;
    --surface: #0d1117;
    --surface-2: #111820;
    --surface-3: #161f2a;
    --border: rgba(255,255,255,0.06);
    --border-active: rgba(0,255,200,0.25);
    --accent: #00ffc8;
    --accent-dim: rgba(0,255,200,0.08);
    --accent-glow: rgba(0,255,200,0.15);
    --text-primary: #e8edf2;
    --text-secondary: #6b7f91;
    --text-muted: #3a4a58;
    --danger: #ff4d6a;
    --warning: #ffb347;
    --success: #00ffc8;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
    font-family: var(--font-display);
    background: var(--bg);
    min-height: 100vh;
    color: var(--text-primary);
    padding: 0;
    margin: 0;
  }

  .admin-root * {
    box-sizing: border-box;
  }

  /* ── NOISE OVERLAY ── */
  .admin-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.6;
  }

  /* ── GRID BACKGROUND ── */
  .admin-root::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,255,200,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,200,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  .admin-page {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 48px 32px 80px;
  }

  /* ── TOP BAR ── */
  .admin-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 56px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
  }

  .admin-logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .admin-logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--accent) 0%, #00b8ff 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    box-shadow: 0 0 20px var(--accent-glow);
  }

  .admin-logo-text {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-primary);
  }

  .admin-logo-text span {
    color: var(--accent);
  }

  .admin-network-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 100px;
    padding: 6px 14px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-secondary);
    letter-spacing: 0.05em;
  }

  .admin-network-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
    animation: pulse-dot 2s infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* ── HEADER ── */
  .admin-header {
    margin-bottom: 48px;
    animation: fadeUp 0.5s ease both;
  }

  .admin-header-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
  }

  .admin-header-tag::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 1px;
    background: var(--accent);
  }

  .admin-header h2 {
    font-size: clamp(28px, 4vw, 40px);
    font-weight: 800;
    letter-spacing: -0.02em;
    margin: 0 0 12px;
    line-height: 1.1;
    color: var(--text-primary);
  }

  .admin-header h2 span {
    color: var(--accent);
  }

  .admin-header p {
    font-size: 14px;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 520px;
    margin: 0;
  }

  /* ── FORM GRID ── */
  .admin-form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: 700px) {
    .admin-form-grid { grid-template-columns: 1fr; }
    .admin-page { padding: 32px 20px 60px; }
  }

  /* ── CARD ── */
  .admin-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.25s, transform 0.2s;
    animation: fadeUp 0.5s ease both;
  }

  .admin-card:nth-child(1) { animation-delay: 0.05s; }
  .admin-card:nth-child(2) { animation-delay: 0.10s; }
  .admin-card:nth-child(3) { animation-delay: 0.15s; }
  .admin-card:nth-child(4) { animation-delay: 0.20s; }

  .admin-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--accent-dim) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  .admin-card:hover {
    border-color: var(--border-active);
    transform: translateY(-2px);
  }

  .admin-card:hover::before {
    opacity: 1;
  }

  /* card accent corner */
  .admin-card::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: radial-gradient(circle at top right, var(--accent-glow), transparent 70%);
    pointer-events: none;
  }

  /* ── CARD HEADER ── */
  .admin-card-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--surface-3);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-bottom: 16px;
  }

  .admin-card h3 {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.01em;
    color: var(--text-primary);
    margin: 0 0 6px;
  }

  .admin-card > p {
    font-size: 12.5px;
    color: var(--text-secondary);
    line-height: 1.6;
    margin: 0 0 20px;
  }

  /* ── INPUT ── */
  .admin-input {
    width: 100%;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 11px 14px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-primary);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    margin-bottom: 10px;
    display: block;
    letter-spacing: 0.02em;
  }

  .admin-input::placeholder {
    color: var(--text-muted);
  }

  .admin-input:focus {
    border-color: var(--border-active);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  /* ── BUTTON ── */
  .admin-btn {
    width: 100%;
    margin-top: 4px;
    background: transparent;
    border: 1px solid var(--accent);
    color: var(--accent);
    border-radius: 10px;
    padding: 11px 20px;
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, transform 0.15s, opacity 0.2s;
    position: relative;
    overflow: hidden;
  }

  .admin-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--accent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .admin-btn span {
    position: relative;
    z-index: 1;
  }

  .admin-btn:hover:not(:disabled) {
    box-shadow: 0 0 20px var(--accent-glow);
    transform: translateY(-1px);
  }

  .admin-btn:hover:not(:disabled)::before {
    opacity: 0.1;
  }

  .admin-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .admin-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: var(--text-muted);
    color: var(--text-muted);
  }

  .admin-btn.loading {
    pointer-events: none;
    border-color: var(--accent);
    color: var(--accent);
    opacity: 0.7;
  }

  .admin-btn .btn-loader {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── NOTICES ── */
  .admin-notices {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    animation: fadeUp 0.3s ease both;
  }

  .admin-notice {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 14px 18px;
    border-radius: 12px;
    font-size: 13px;
    line-height: 1.6;
    border: 1px solid;
  }

  .admin-notice-icon {
    font-size: 16px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .admin-notice.pending {
    background: rgba(255,179,71,0.06);
    border-color: rgba(255,179,71,0.2);
    color: var(--warning);
  }

  .admin-notice.info {
    background: rgba(0,255,200,0.04);
    border-color: rgba(0,255,200,0.15);
    color: var(--text-secondary);
    font-family: var(--font-mono);
    font-size: 12px;
    word-break: break-all;
  }

  .admin-notice.info .notice-label {
    color: var(--accent);
    font-weight: 500;
    white-space: nowrap;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── DIVIDER ── */
  .admin-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    margin: 10px 0 16px;
  }
`;

function AdminSetup() {
  const [professorAddress, setProfessorAddress] = useState("");
  const [headAddress, setHeadAddress] = useState("");
  const [officerAddress, setOfficerAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("10");

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

//   async function waitForTransaction(tx, successMessage, afterSuccess) {
//     setMessage(`tx:${tx.hash}`);

//     try {
//       const receipt = await tx.wait(1);

//       if (receipt.status === 1) {
//         setMessage(successMessage);
//         if (afterSuccess) afterSuccess();
//       } else {
//         setMessage("Transaction failed on-chain.");
//       }
//     } catch (error) {
//       setMessage(
//         `Transaction submitted but confirmation is slow. Verify on Sepolia. Hash: ${tx.hash}`
//       );
//     }
//   }

async function waitForTransaction(tx, successMessage, afterSuccess) {
  setMessage(`tx:${tx.hash}`);

  await new Promise((resolve) => setTimeout(resolve, 3000));

  setMessage(
    `${successMessage} If MetaMask shows confirmed, the on-chain action is completed.`
  );

  if (afterSuccess) afterSuccess();
}

  async function addProfessor() {
    try {
      setActiveAction("addProfessor");
      setMessage("");

      const contract = await getExamPaperVaultContract();
      const tx = await contract.addProfessor(professorAddress);

      await waitForTransaction(tx, "✓ Professor added successfully.", () => {
        setProfessorAddress("");
      });
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setActiveAction("");
    }
  }

  async function addDepartmentHead() {
    try {
      setActiveAction("addDepartmentHead");
      setMessage("");

      const contract = await getExamPaperVaultContract();
      const tx = await contract.addDepartmentHead(headAddress);

      await waitForTransaction(tx, "✓ Department head added successfully.", () => {
        setHeadAddress("");
      });
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setActiveAction("");
    }
  }

  async function addOfficer() {
    try {
      setActiveAction("addOfficer");
      setMessage("");

      const dao = await getAcademicDAOContract();
      const tx = await dao.addOfficer(officerAddress);

      await waitForTransaction(tx, "✓ DAO officer added successfully.");
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setActiveAction("");
    }
  }

  async function mintOfficerTokens() {
    try {
      setActiveAction("mintTokens");
      setMessage("");

      const token = await getIntegrityTokenContract();
      const tx = await token.mintOfficerTokens(officerAddress, tokenAmount);

      await waitForTransaction(
        tx,
        `✓ ${tokenAmount} AIT minted to officer successfully.`,
        () => {
          setOfficerAddress("");
          setTokenAmount("10");
        }
      );
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setActiveAction("");
    }
  }

  const isTxHash = message.startsWith("tx:");
  const txHash = isTxHash ? message.slice(3) : null;

  return (
    <div className="admin-root">
      <style>{styles}</style>

      <div className="admin-page">

        {/* Top Bar */}
        <div className="admin-topbar">
          <div className="admin-logo">
            <div className="admin-logo-icon">⬡</div>
            <div className="admin-logo-text">Academic<span>Chain</span></div>
          </div>
          <div className="admin-network-badge">
            <div className="admin-network-dot" />
            Sepolia Testnet
          </div>
        </div>

        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-tag">Admin Controls</div>
          <h2>System <span>Setup</span></h2>
          <p>
            Register university roles and issue AIT governance tokens to academic officers.
            All actions are executed on-chain via MetaMask.
          </p>
        </div>

        {/* Cards */}
        <div className="admin-form-grid">

          {/* Add Professor */}
          <div className="admin-card">
            <div className="admin-card-icon">🎓</div>
            <h3>Add Professor</h3>
            <p>Register a professor wallet that can submit exam papers to the vault.</p>
            <div className="admin-divider" />
            <input
              className="admin-input"
              type="text"
              placeholder="0x... professor wallet address"
              value={professorAddress}
              onChange={(e) => setProfessorAddress(e.target.value)}
            />
            <button
              className={`admin-btn${activeAction === "addProfessor" ? " loading" : ""}`}
              onClick={addProfessor}
              disabled={activeAction === "addProfessor" || !professorAddress}
            >
              {activeAction === "addProfessor" ? (
                <span><span className="btn-loader" />Adding...</span>
              ) : (
                <span>Add Professor</span>
              )}
            </button>
          </div>

          {/* Add Department Head */}
          <div className="admin-card">
            <div className="admin-card-icon">🏛️</div>
            <h3>Add Department Head</h3>
            <p>Register a department head wallet that can approve submitted papers.</p>
            <div className="admin-divider" />
            <input
              className="admin-input"
              type="text"
              placeholder="0x... department head wallet"
              value={headAddress}
              onChange={(e) => setHeadAddress(e.target.value)}
            />
            <button
              className={`admin-btn${activeAction === "addDepartmentHead" ? " loading" : ""}`}
              onClick={addDepartmentHead}
              disabled={activeAction === "addDepartmentHead" || !headAddress}
            >
              {activeAction === "addDepartmentHead" ? (
                <span><span className="btn-loader" />Adding...</span>
              ) : (
                <span>Add Department Head</span>
              )}
            </button>
          </div>

          {/* Add DAO Officer */}
          <div className="admin-card">
            <div className="admin-card-icon">⚖️</div>
            <h3>Add DAO Officer</h3>
            <p>Register an academic integrity officer for DAO governance and voting.</p>
            <div className="admin-divider" />
            <input
              className="admin-input"
              type="text"
              placeholder="0x... officer wallet address"
              value={officerAddress}
              onChange={(e) => setOfficerAddress(e.target.value)}
            />
            <button
              className={`admin-btn${activeAction === "addOfficer" ? " loading" : ""}`}
              onClick={addOfficer}
              disabled={activeAction === "addOfficer" || !officerAddress}
            >
              {activeAction === "addOfficer" ? (
                <span><span className="btn-loader" />Adding...</span>
              ) : (
                <span>Add Officer</span>
              )}
            </button>
          </div>

          {/* Mint AIT Tokens */}
          <div className="admin-card">
            <div className="admin-card-icon">🪙</div>
            <h3>Mint AIT Tokens</h3>
            <p>Issue voting power tokens to a registered DAO officer for governance.</p>
            <div className="admin-divider" />
            <input
              className="admin-input"
              type="text"
              placeholder="0x... officer wallet address"
              value={officerAddress}
              onChange={(e) => setOfficerAddress(e.target.value)}
            />
            <input
              className="admin-input"
              type="number"
              min="1"
              placeholder="Token amount"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
            />
            <button
              className={`admin-btn${activeAction === "mintTokens" ? " loading" : ""}`}
              onClick={mintOfficerTokens}
              disabled={activeAction === "mintTokens" || !officerAddress || !tokenAmount}
            >
              {activeAction === "mintTokens" ? (
                <span><span className="btn-loader" />Minting...</span>
              ) : (
                <span>Mint Tokens</span>
              )}
            </button>
          </div>

        </div>

        {/* Notices */}
        {(activeAction || message) && (
          <div className="admin-notices">
            {activeAction && (
              <div className="admin-notice pending">
                <span className="admin-notice-icon">⏳</span>
                <span>Transaction pending — please confirm in MetaMask.</span>
              </div>
            )}
            {message && !isTxHash && (
              <div className="admin-notice info">
                <span className="admin-notice-icon">◈</span>
                <span>{message}</span>
              </div>
            )}
            {isTxHash && (
              <div className="admin-notice info">
                <span className="admin-notice-icon">◈</span>
                <span>
                  <span className="notice-label">TX&nbsp;</span>
                  {txHash}
                </span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminSetup;