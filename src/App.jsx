import { useEffect, useState } from "react";
import "./App.css";
import AdminSetup from "./pages/AdminSetup";
import SubmitPaper from "./pages/SubmitPaper";
import ApprovePaper from "./pages/ApprovePaper";
import VerifyPaper from "./pages/VerifyPaper";
import Governance from "./pages/Governance";
import RoleLoader from "./components/RoleLoader";

import {
  connectWallet,
  checkSepoliaNetwork,
  getCurrentAccount,
} from "./utils/web3";

import {
  getExamPaperVaultContract,
  getAcademicDAOContract,
} from "./utils/contracts";

function App() {
  const [account, setAccount] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRoleLoader, setShowRoleLoader] = useState(false);

  useEffect(() => {
    checkAlreadyConnected();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  async function checkAlreadyConnected() {
    try {
      const currentAccount = await getCurrentAccount();

      if (!currentAccount) {
        setAccount("");
        setRole("");
        return;
      }

      await checkSepoliaNetwork();

      setAccount(currentAccount);

      const detectedRole = await detectRole(currentAccount);
      setRole(detectedRole);
      triggerRoleLoader(detectedRole);
      setMessage(`Connected as ${detectedRole}`);
    } catch (error) {
      setMessage(error.message || "Failed to detect wallet.");
    }
  }

  async function handleAccountsChanged(accounts) {
    try {
      if (!accounts || accounts.length === 0) {
        setAccount("");
        setRole("");
        setMessage("Wallet disconnected.");
        return;
      }

      const newAccount = accounts[0];

      await checkSepoliaNetwork();

      setAccount(newAccount);

      const detectedRole = await detectRole(newAccount);
      setRole(detectedRole);
      triggerRoleLoader(detectedRole);
      setMessage(`Switched wallet. Connected as ${detectedRole}`);
    } catch (error) {
      setMessage(error.message || "Failed to switch account.");
    }
  }

  function handleChainChanged() {
    window.location.reload();
  }

  async function handleConnectWallet() {
    try {
      setLoading(true);
      setMessage("");

      const connectedAccount = await connectWallet();
      await checkSepoliaNetwork();

      setAccount(connectedAccount);

      const detectedRole = await detectRole(connectedAccount);
      setRole(detectedRole);
      triggerRoleLoader(detectedRole);

      setMessage(`Wallet connected successfully as ${detectedRole}`);
    } catch (error) {
      setMessage(error.message || "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
   }


   function triggerRoleLoader(detectedRole) {
  if (!detectedRole) return;

  setShowRoleLoader(true);

  setTimeout(() => {
    setShowRoleLoader(false);
  }, 2000);
}

  async function detectRole(walletAddress) {
    const examVault = await getExamPaperVaultContract();
    const dao = await getAcademicDAOContract();

    const adminAddress = await examVault.admin();

    if (walletAddress.toLowerCase() === adminAddress.toLowerCase()) {
      return "Admin";
    }

    const isProfessor = await examVault.professors(walletAddress);
    if (isProfessor) {
      return "Professor";
    }

    const isDepartmentHead = await examVault.departmentHeads(walletAddress);
    if (isDepartmentHead) {
      return "Department Head";
    }

    const isOfficer = await dao.isOfficer(walletAddress);
    if (isOfficer) {
      return "Academic Officer";
    }

    return "Public User";
  }

  function shortAddress(address) {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  function getRoleDescription() {
    if (role === "Admin") {
      return "Manage roles, officers, governance tokens, and system setup.";
    }

    if (role === "Professor") {
      return "Submit encrypted exam paper references and release keys after exam time.";
    }

    if (role === "Department Head") {
      return "Review and approve submitted exam papers before they are locked.";
    }

    if (role === "Academic Officer") {
      return "Create proposals, vote on allegations, and execute DAO decisions.";
    }

    if (role === "Public User") {
      return "Verify paper authenticity using the on-chain hash.";
    }

    return "Connect your wallet to detect your role.";
  }

  return (
    <div className="app-shell">
      {showRoleLoader && <RoleLoader role={role} />}
      <div className="gradient-orb orb-one"></div>
      <div className="gradient-orb orb-two"></div>

      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">Ξ</div>
          <div>
            <h2 style={{color:"white"}}>ExamChain</h2>
            <span>Decentralized Exam Integrity</span>
          </div>
        </div>

        {account ? (
          <div className="wallet-pill">
            <span className="status-dot"></span>
            {shortAddress(account)}
          </div>
        ) : (
          <button className="nav-button" onClick={handleConnectWallet}>
            Connect Wallet
          </button>
        )}
      </nav>

      <main className="hero-section">
        <section className="hero-left">
          <div className="eyebrow">Blockchain Based Academic Integrity</div>

          <h1 style={{color:"white"}}>
            Secure exam papers with{" "}
            <span>on-chain proof and DAO governance.</span>
          </h1>

          <p className="hero-text">
            Professors submit paper hashes, department heads approve submissions,
            and academic officers resolve disputes using token-based governance.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={handleConnectWallet}
              disabled={loading}
            >
              {loading ? "Connecting..." : account ? "Refresh Role" : "Connect MetaMask"}
            </button>

            <button className="secondary-button">
              View Architecture
            </button>
          </div>

          {message && <div className="message-box">{message}</div>}
        </section>

        <section className="hero-card">
          <div className="card-header">
            <p>Current Session</p>
            <span className={`role-badge ${role ? "active" : ""}`}>
              {role || "Not Connected"}
            </span>
          </div>

          <div className="wallet-preview">
            <div className="wallet-avatar">
              {role ? role.charAt(0) : "?"}
            </div>

            <div>
              <p className="label">Wallet Address</p>
              <h3>{account ? shortAddress(account) : "No wallet connected"}</h3>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-card">
              <span>Network</span>
              <strong>Sepolia</strong>
            </div>

            <div className="info-card">
              <span>Role</span>
              <strong>{role || "Unknown"}</strong>
            </div>
          </div>

          <div className="role-panel">
            <p className="label">Access Summary</p>
            <h3>{getRoleDescription()}</h3>
          </div>
        </section>
      </main>

      <section className="dashboard-grid">
        {role === "Admin" && (
          <>
            <FeatureCard
              title="Admin Setup"
              text="Add professors, department heads, DAO officers, and mint AIT governance tokens."
              tag="Admin"
            />
            <FeatureCard
              title="Role Management"
              text="Register trusted university roles using wallet addresses."
              tag="Access"
            />
            <FeatureCard
              title="Token Minting"
              text="Issue Academic Integrity Tokens to officers for DAO voting power."
              tag="ERC-20"
            />
          </>
        )}

        {role === "Professor" && (
          <>
            <FeatureCard
              title="Submit Paper"
              text="Upload a paper, generate a SHA-256 hash, and store the proof on-chain."
              tag="Hash"
            />
            <FeatureCard
              title="Release Key"
              text="Release the decryption key only after the official exam time."
              tag="Time Lock"
            />
          </>
        )}

        {role === "Department Head" && (
          <>
            <FeatureCard
              title="Approve Paper"
              text="Review pending papers and approve them before final locking."
              tag="Approval"
            />
            <FeatureCard
              title="Multi-Signature Flow"
              text="A paper is locked only after the required number of approvals."
              tag="Multi-Sig"
            />
          </>
        )}

        {role === "Academic Officer" && (
          <>
            <FeatureCard
              title="DAO Governance"
              text="Create proposals, vote on leakage allegations, and execute decisions."
              tag="DAO"
            />
            <FeatureCard
              title="Voting Power"
              text="Your AIT token balance determines your vote weight."
              tag="AIT"
            />
          </>
        )}

        {role === "Public User" && (
          <>
            <FeatureCard
              title="Verify Paper"
              text="Upload or paste a paper hash to compare it with the on-chain record."
              tag="Verify"
            />
            <FeatureCard
              title="Transparency"
              text="Anyone can verify whether the paper matches the original submitted hash."
              tag="Public"
            />
          </>
        )}

        {!role && (
          <>
            <FeatureCard
              title="Paper Integrity"
              text="Store cryptographic proof of exam papers on-chain before exams."
              tag="Core"
            />
            <FeatureCard
              title="Department Approval"
              text="Require multiple department heads to approve a paper before it is locked."
              tag="Multi-Sig"
            />
            <FeatureCard
              title="DAO Disputes"
              text="Resolve leakage allegations through token-based academic governance."
              tag="DAO"
            />
          </>
        )}
      </section>
        {role === "Admin" && <AdminSetup />}
        {role === "Professor" && <SubmitPaper />}
        {role === "Department Head" && <ApprovePaper />}
        {role && <VerifyPaper />}
        {role === "Academic Officer" && <Governance />}
    </div>
  );
}

function FeatureCard({ title, text, tag }) {
  return (
    <div className="feature-card">
      <span>{tag}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default App;