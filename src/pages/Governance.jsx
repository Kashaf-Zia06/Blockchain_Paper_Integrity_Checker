import { useState } from "react";
import { ethers } from "ethers";
import {
  getAcademicDAOContract,
  getIntegrityTokenContract,
} from "../utils/contracts";

function Governance() {
  const [paperId, setPaperId] = useState("1");
  const [description, setDescription] = useState("");

  const [proposalId, setProposalId] = useState("1");
  const [proposal, setProposal] = useState(null);
  const [tokenBalance, setTokenBalance] = useState("");

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

  function formatProposal(data) {
    return {
      id: data[0].toString(),
      paperId: data[1].toString(),
      description: data[2],
      yesVotes: ethers.formatEther(data[3]),
      noVotes: ethers.formatEther(data[4]),
      deadline: Number(data[5]),
      executed: data[6],
      compromised: data[7],
    };
  }

  function formatDeadline(timestamp) {
    if (!timestamp) return "-";
    return new Date(timestamp * 1000).toLocaleString();
  }

  function isVotingEnded(deadline) {
    if (!deadline) return false;
    return Math.floor(Date.now() / 1000) > deadline;
  }

  async function loadMyTokenBalance() {
    try {
      setActiveAction("balance");
      setMessage("");

      if (!window.ethereum) {
        setMessage("MetaMask is not installed.");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (!accounts || accounts.length === 0) {
        setMessage("Please connect wallet first.");
        return;
      }

      const token = await getIntegrityTokenContract();
      const balance = await token.balanceOf(accounts[0]);

      setTokenBalance(ethers.formatEther(balance));
      setMessage("Token balance loaded.");
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setActiveAction("");
    }
  }

  async function createProposal() {
    try {
      setActiveAction("create");
      setMessage("");

      if (!paperId || !description) {
        setMessage("Please enter paper ID and proposal description.");
        return;
      }

      const dao = await getAcademicDAOContract();

      const tx = await dao.createProposal(paperId, description);

      setMessage(`Proposal creation transaction submitted. Hash: ${tx.hash}`);

      setTimeout(() => {
        setMessage(
          "If MetaMask shows confirmed, proposal is created. Load the latest proposal ID to view it."
        );
        setDescription("");
        setActiveAction("");
      }, 3000);
    } catch (error) {
      setMessage(getErrorMessage(error));
      setActiveAction("");
    }
  }

  async function loadProposal() {
    try {
      setActiveAction("load");
      setMessage("");

      const dao = await getAcademicDAOContract();
      const data = await dao.getProposal(proposalId);

      const formatted = formatProposal(data);
      setProposal(formatted);

      setMessage("Proposal loaded successfully.");
    } catch (error) {
      setProposal(null);
      setMessage(getErrorMessage(error));
    } finally {
      setActiveAction("");
    }
  }

  async function voteProposal(support) {
    try {
      setActiveAction(support ? "voteYes" : "voteNo");
      setMessage("");

      const dao = await getAcademicDAOContract();
      const tx = await dao.vote(proposalId, support);

      setMessage(`Vote transaction submitted. Hash: ${tx.hash}`);

      setTimeout(() => {
        setMessage(
          "If MetaMask shows confirmed, your vote is recorded. Reload proposal to see updated votes."
        );
        setActiveAction("");
      }, 3000);
    } catch (error) {
      setMessage(getErrorMessage(error));
      setActiveAction("");
    }
  }

  async function executeProposal() {
    try {
      setActiveAction("execute");
      setMessage("");

      const dao = await getAcademicDAOContract();
      const tx = await dao.executeProposal(proposalId);

      setMessage(`Execute transaction submitted. Hash: ${tx.hash}`);

      setTimeout(() => {
        setMessage(
          "If MetaMask shows confirmed, proposal execution is done. Reload proposal and verify paper status."
        );
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
        <span>DAO Governance</span>
        <h2 style={{color:"white"}}>Academic Integrity DAO</h2>
        <p>
          Academic officers can create proposals, vote using AIT token balance,
          and execute decisions after the voting period ends.
        </p>
      </div>

      <div className="form-grid">
        <div className="form-card">
          <h3>Your Voting Power</h3>
          <p>
            Your AIT token balance is used as your DAO voting power.
          </p>

          <button
            onClick={loadMyTokenBalance}
            disabled={activeAction === "balance"}
          >
            {activeAction === "balance" ? "Loading..." : "Load My AIT Balance"}
          </button>

          {tokenBalance && (
            <div className="mini-info">
              Voting Power: <strong>{tokenBalance} AIT</strong>
            </div>
          )}
        </div>

        <div className="form-card">
          <h3>Create Proposal</h3>
          <p>
            Create an allegation proposal against a submitted paper.
          </p>

          <label>Paper ID</label>
          <input
            type="number"
            min="1"
            value={paperId}
            onChange={(e) => setPaperId(e.target.value)}
          />

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Example: Mark this paper as compromised due to suspected leak."
          />

          <button
            onClick={createProposal}
            disabled={activeAction === "create" || !paperId || !description}
          >
            {activeAction === "create" ? "Creating..." : "Create Proposal"}
          </button>
        </div>

        <div className="form-card">
          <h3>Load Proposal</h3>
          <p>
            Load proposal details before voting or execution.
          </p>

          <label>Proposal ID</label>
          <input
            type="number"
            min="1"
            value={proposalId}
            onChange={(e) => setProposalId(e.target.value)}
          />

          <button onClick={loadProposal} disabled={activeAction === "load"}>
            {activeAction === "load" ? "Loading..." : "Load Proposal"}
          </button>
        </div>

        <div className="form-card">
          <h3>Vote / Execute</h3>
          <p>
            Officers can vote before deadline. After deadline, anyone can execute.
          </p>

          <button
            onClick={() => voteProposal(true)}
            disabled={activeAction === "voteYes" || !proposalId}
          >
            {activeAction === "voteYes" ? "Voting..." : "Vote Yes"}
          </button>

          <button
            onClick={() => voteProposal(false)}
            disabled={activeAction === "voteNo" || !proposalId}
            className="danger-button"
          >
            {activeAction === "voteNo" ? "Voting..." : "Vote No"}
          </button>

          <button
            onClick={executeProposal}
            disabled={activeAction === "execute" || !proposalId}
            className="execute-button"
          >
            {activeAction === "execute" ? "Executing..." : "Execute Proposal"}
          </button>
        </div>
      </div>

      {proposal && (
        <div className="paper-box">
          <h3>Proposal #{proposal.id}</h3>

          <p>
            <strong>Paper ID:</strong> {proposal.paperId}
          </p>

          <p>
            <strong>Description:</strong> {proposal.description}
          </p>

          <p>
            <strong>Yes Votes:</strong> {proposal.yesVotes} AIT
          </p>

          <p>
            <strong>No Votes:</strong> {proposal.noVotes} AIT
          </p>

          <p>
            <strong>Deadline:</strong> {formatDeadline(proposal.deadline)}
          </p>

          <p>
            <strong>Voting Ended:</strong>{" "}
            {isVotingEnded(proposal.deadline) ? "Yes" : "No"}
          </p>

          <p>
            <strong>Executed:</strong> {proposal.executed ? "Yes" : "No"}
          </p>

          <p>
            <strong>Compromised Decision:</strong>{" "}
            {proposal.compromised ? "Paper marked compromised" : "Not compromised"}
          </p>
        </div>
      )}

      {activeAction && (
        <div className="notice pending">
          Processing. Confirm MetaMask if prompted.
        </div>
      )}

      {message && <div className="notice">{message}</div>}
    </section>
  );
}

export default Governance;