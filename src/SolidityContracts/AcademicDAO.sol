// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Interface to communicate with ExamPaperVault contract
interface IExamPaperVault {
    function markCompromised(uint paperId) external;
}

contract AcademicDAO {
    address public admin;

    // Reference to the AIT token contract for checking voting power
    IERC20 public integrityToken;

    // Reference to the ExamPaperVault contract
    IExamPaperVault public examVault;

    // Registered academic integrity officers
    mapping(address => bool) public isOfficer;

    struct Proposal {
        uint id;
        uint paperId;
        string description;
        uint yesVotes;
        uint noVotes;
        uint deadline;
        bool executed;
        bool compromised;
    }

    mapping(uint => Proposal) public proposals;
    uint public proposalCount;

    // proposalId => voter => voted or not
    mapping(uint => mapping(address => bool)) public hasVoted;

    event OfficerAdded(address officer);
    event ProposalCreated(uint proposalId, uint paperId, string description, uint deadline);
    event VoteCast(uint proposalId, address voter, bool support, uint votingPower);
    event ProposalExecuted(uint proposalId, bool compromised);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyOfficer() {
        require(isOfficer[msg.sender], "Only registered officers");
        _;
    }

    modifier proposalExists(uint _proposalId) {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Proposal does not exist");
        _;
    }

    constructor(address _tokenAddress, address _examVaultAddress) {
        require(_tokenAddress != address(0), "Invalid token address");
        require(_examVaultAddress != address(0), "Invalid vault address");

        admin = msg.sender;
        integrityToken = IERC20(_tokenAddress);
        examVault = IExamPaperVault(_examVaultAddress);
    }

    function addOfficer(address _officer) public onlyAdmin {
        require(_officer != address(0), "Invalid address");
        require(_officer != admin, "Admin cannot be officer");
        require(!isOfficer[_officer], "Already an officer");

        isOfficer[_officer] = true;

        emit OfficerAdded(_officer);
    }

    function createProposal(uint _paperId, string memory _description)
        public
        onlyOfficer
    {
        require(_paperId > 0, "Invalid paper ID");
        require(bytes(_description).length > 0, "Description cannot be empty");

        proposalCount++;

       // Voting period for each proposal.
        uint deadline = block.timestamp + 5 minutes;

        proposals[proposalCount] = Proposal({
            id: proposalCount,
            paperId: _paperId,
            description: _description,
            yesVotes: 0,
            noVotes: 0,
            deadline: deadline,
            executed: false,
            compromised: false
        });

        emit ProposalCreated(proposalCount, _paperId, _description, deadline);
    }

    function vote(uint _proposalId, bool _support)
        public
        onlyOfficer
        proposalExists(_proposalId)
    {
        Proposal storage p = proposals[_proposalId];

        require(block.timestamp <= p.deadline, "Voting period has ended");
        require(!hasVoted[_proposalId][msg.sender], "You have already voted");

        uint votingPower = integrityToken.balanceOf(msg.sender);
        require(votingPower > 0, "You have no voting power");

        hasVoted[_proposalId][msg.sender] = true;

        if (_support) {
            p.yesVotes += votingPower;
        } else {
            p.noVotes += votingPower;
        }

        emit VoteCast(_proposalId, msg.sender, _support, votingPower);
    }

    function executeProposal(uint _proposalId)
        public
        proposalExists(_proposalId)
    {
        Proposal storage p = proposals[_proposalId];

        require(block.timestamp > p.deadline, "Voting period not ended yet");
        require(!p.executed, "Proposal already executed");

        p.executed = true;

        if (p.yesVotes > p.noVotes) {
            p.compromised = true;
            examVault.markCompromised(p.paperId);
        }

        emit ProposalExecuted(_proposalId, p.compromised);
    }

    function getProposal(uint _proposalId)
        public
        view
        proposalExists(_proposalId)
        returns (
            uint id,
            uint paperId,
            string memory description,
            uint yesVotes,
            uint noVotes,
            uint deadline,
            bool executed,
            bool compromised
        )
    {
        Proposal memory p = proposals[_proposalId];

        return (
            p.id,
            p.paperId,
            p.description,
            p.yesVotes,
            p.noVotes,
            p.deadline,
            p.executed,
            p.compromised
        );
    }
}