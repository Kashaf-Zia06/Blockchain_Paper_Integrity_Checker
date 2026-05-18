import { ethers } from "ethers";

import ExamPaperVaultABI from "../contracts/ExamPaperVault.json";
import IntegrityTokenABI from "../contracts/IntegrityToken.json";
import AcademicDAOABI from "../contracts/AcademicDAO.json";

import {
  EXAM_PAPER_VAULT_ADDRESS,
  INTEGRITY_TOKEN_ADDRESS,
  ACADEMIC_DAO_ADDRESS,
} from "../contracts/addresses";

function getAbi(importedJson) {
  return importedJson.abi ? importedJson.abi : importedJson;
}

async function getSigner() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  return await provider.getSigner();
}

export async function getExamPaperVaultContract() {
  const signer = await getSigner();

  return new ethers.Contract(
    EXAM_PAPER_VAULT_ADDRESS,
    getAbi(ExamPaperVaultABI),
    signer
  );
}

export async function getIntegrityTokenContract() {
  const signer = await getSigner();

  return new ethers.Contract(
    INTEGRITY_TOKEN_ADDRESS,
    getAbi(IntegrityTokenABI),
    signer
  );
}

export async function getAcademicDAOContract() {
  const signer = await getSigner();

  return new ethers.Contract(
    ACADEMIC_DAO_ADDRESS,
    getAbi(AcademicDAOABI),
    signer
  );
}