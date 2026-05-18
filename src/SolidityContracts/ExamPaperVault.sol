// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ExamPaperVault {
    address public admin;
    uint public paperCount;
    uint public departmentHeadCount;

    mapping(address => bool) public professors;
    mapping(address => bool) public departmentHeads;

    struct Paper {
        uint id;
        string courseCode;
        string examTitle;
        string paperHash;
        string encryptedFileReference;
        address professor;
        uint examStartTime;
        uint requiredApprovals;
        uint approvalCount;
        bool isLocked;
        bool isKeyReleased;
        bool isCompromised;
    }

    mapping(uint => Paper) public papers;
    mapping(uint => string) public decryptionKeys;

    address public daoContract;

    // paperId => departmentHeadAddress => approved or not
    mapping(uint => mapping(address => bool)) public hasApproved;

    event ProfessorAdded(address professor);
    event DepartmentHeadAdded(address departmentHead);
    event PaperSubmitted(uint paperId, string courseCode, string examTitle, address professor);
    event PaperApproved(uint paperId, address departmentHead, uint approvalCount);
    event PaperLocked(uint paperId);
    event KeyReleased(uint paperId);
    event PaperCompromised(uint paperId);
    event PaperVerified(uint paperId, bool isValid);
    event DAOContractSet(address daoContract);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier onlyProfessor() {
        require(professors[msg.sender] == true, "Only professor can perform this action");
        _;
    }

    modifier onlyDepartmentHead() {
        require(departmentHeads[msg.sender] == true, "Only department head can perform this action");
        _;
    }

    modifier onlyDAO() {
        require(msg.sender == daoContract, "Only DAO contract can do this");
        _;
    }

    modifier paperExists(uint _paperId) {
        require(_paperId > 0 && _paperId <= paperCount, "Paper does not exist");
        _;
    }

    function addProfessor(address _professor) public onlyAdmin {
        require(_professor != address(0), "Invalid professor address");
        require(_professor != admin, "Admin cannot be professor");
        require(!professors[_professor], "Already professor");
        require(!departmentHeads[_professor], "Address already department head");

        professors[_professor] = true;

        emit ProfessorAdded(_professor);
    }

    function addDepartmentHead(address _head) public onlyAdmin {
        require(_head != address(0), "Invalid department head address");
        require(_head != admin, "Admin cannot be department head");
        require(!departmentHeads[_head], "Already department head");
        require(!professors[_head], "Address already professor");

        departmentHeads[_head] = true;
        departmentHeadCount++;

        emit DepartmentHeadAdded(_head);
    }

    function submitPaper(
        string memory _courseCode,
        string memory _examTitle,
        string memory _paperHash,
        string memory _encryptedFileReference,
        uint _examStartTime,
        uint _requiredApprovals
    ) public onlyProfessor {
        require(bytes(_courseCode).length > 0, "Course code is required");
        require(bytes(_examTitle).length > 0, "Exam title is required");
        require(bytes(_paperHash).length > 0, "Paper hash is required");
        require(bytes(_encryptedFileReference).length > 0, "Encrypted file reference is required");
        require(_examStartTime > block.timestamp, "Exam time must be in future");
        require(_requiredApprovals > 0, "Required approvals must be greater than zero");
        require(departmentHeadCount > 0, "No department heads registered");
        require(_requiredApprovals <= departmentHeadCount, "Required approvals exceed department heads");

        paperCount++;

        Paper storage newPaper = papers[paperCount];

        newPaper.id = paperCount;
        newPaper.courseCode = _courseCode;
        newPaper.examTitle = _examTitle;
        newPaper.paperHash = _paperHash;
        newPaper.encryptedFileReference = _encryptedFileReference;
        newPaper.professor = msg.sender;
        newPaper.examStartTime = _examStartTime;
        newPaper.requiredApprovals = _requiredApprovals;
        newPaper.approvalCount = 0;
        newPaper.isLocked = false;
        newPaper.isKeyReleased = false;
        newPaper.isCompromised = false;

        emit PaperSubmitted(paperCount, _courseCode, _examTitle, msg.sender);
    }

    function approvePaper(uint _paperId) public onlyDepartmentHead paperExists(_paperId) {
        Paper storage paper = papers[_paperId];

        require(paper.isLocked == false, "Paper is already locked");
        require(hasApproved[_paperId][msg.sender] == false, "You already approved this paper");

        hasApproved[_paperId][msg.sender] = true;
        paper.approvalCount++;

        emit PaperApproved(_paperId, msg.sender, paper.approvalCount);

        if (paper.approvalCount >= paper.requiredApprovals) {
            paper.isLocked = true;
            emit PaperLocked(_paperId);
        }
    }

    function releaseKey(uint _paperId, string memory _decryptionKey)
        public
        paperExists(_paperId)
    {
        Paper storage paper = papers[_paperId];

        require(msg.sender == paper.professor, "Only original professor can release key");
        require(paper.isLocked == true, "Paper must be locked before key release");
        require(block.timestamp >= paper.examStartTime, "Exam time has not started yet");
        require(paper.isKeyReleased == false, "Key already released");
        require(bytes(_decryptionKey).length > 0, "Decryption key is required");

        decryptionKeys[_paperId] = _decryptionKey;
        paper.isKeyReleased = true;

        emit KeyReleased(_paperId);
    }

    function verifyPaper(uint _paperId, string memory _hashToCheck)
        public
        paperExists(_paperId)
        returns (bool)
    {
        Paper storage paper = papers[_paperId];

        bool isValid =
            keccak256(bytes(paper.paperHash)) ==
            keccak256(bytes(_hashToCheck));

        emit PaperVerified(_paperId, isValid);

        return isValid;
    }

    function setDAOContract(address _daoContract) public onlyAdmin {
        require(_daoContract != address(0), "Invalid DAO address");

        daoContract = _daoContract;

        emit DAOContractSet(_daoContract);
    }

    function markCompromised(uint _paperId) public onlyDAO paperExists(_paperId) {
        Paper storage paper = papers[_paperId];

        require(!paper.isCompromised, "Paper already marked compromised");

        paper.isCompromised = true;

        emit PaperCompromised(_paperId);
    }
}