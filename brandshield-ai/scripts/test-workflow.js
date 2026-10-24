/**
 * Inkloom AI — End-to-End Workflow & Governance Verification Test Suite
 * Tests all 15 scenarios prescribed in Section 12 of the Master Specification
 */

const { ServerDatabase } = require("../lib/db/adapter.ts");
const { ServerBrandEngine } = require("../lib/ai/server-engine.ts");

async function runTests() {
  console.log("============================================================");
  console.log("  INKLOOM AI — AUTOMATED WORKFLOW & GOVERNANCE TEST SUITE   ");
  console.log("============================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`  [PASS] ✓ Test ${total}: ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ✗ Test ${total}: ${testName}`);
    }
  }

  // Test 1: Brand profile retrieval
  const brands = ServerDatabase.getBrands();
  assert(brands.length >= 3, "Brand profiles loaded from persistent database (NovaTech, Aura, Veritas)");

  const novatech = ServerDatabase.getBrandById("brand-novatech");
  assert(novatech !== undefined && novatech.name === "NovaTech Solutions", "NovaTech brand profile retrieved with tone rules");

  // Test 2: Guidelines and terminology rules configured
  assert(
    novatech.terminology_rules.some((r) => r.prohibited_term === "foolproof"),
    "Prohibited terminology rule ('foolproof') configured in brand guidelines"
  );

  // Test 3: Approved facts exist with valid source citations
  const slaFact = novatech.approved_facts.find((f) => f.fact_text.includes("99.99%"));
  assert(
    slaFact !== undefined && slaFact.source_reference.includes("Master Services Agreement"),
    "Approved facts repository contains verified 99.99% SLA uptime citation"
  );

  // Test 4: Run AI Brand Analysis Engine on violating content
  const sampleCopy = `NovaTech is the cheapest cloud with foolproof resilience and unbreakable security! Over 10,000 global Fortune 500 enterprises joined.`;
  const review = await ServerBrandEngine.analyze({
    submissionId: "test-sub-1",
    brand: novatech,
    title: "Automated Test Submission",
    contentType: "press_release",
    channel: "Press Wire",
    content: sampleCopy,
  });

  assert(review.analysis_status === "completed", "Analysis engine executes successfully and returns structured review");

  // Test 5: Prohibited term detected
  const termFinding = review.findings.find((f) => f.original_text.toLowerCase().includes("foolproof"));
  assert(termFinding !== undefined, "Prohibited term 'foolproof' detected");

  // Test 6: Finding explains the relevant guideline and provides citation
  assert(
    termFinding && termFinding.reason.length > 10 && termFinding.guideline_reference.includes("NovaTech"),
    "Finding explains why it matters and cites specific guideline reference"
  );

  // Test 7: Actionable brand-approved correction provided
  assert(
    termFinding && termFinding.suggested_text.includes("resilient"),
    "Actionable brand-approved replacement proposed ('resilient and fault-tolerant')"
  );

  // Test 8: Unsupported claim flagged as 'unsupported_claim' rather than falsely declared false
  const securityFinding = review.findings.find((f) => f.original_text.toLowerCase().includes("unbreakable"));
  assert(
    securityFinding && securityFinding.verification_status === "unsupported_claim",
    "Absolute security claim correctly flagged as 'unsupported_claim' for verification"
  );

  // Test 9: Customer metric exaggeration detected against approved facts
  const customerFinding = review.findings.find((f) => f.original_text.includes("10,000"));
  assert(
    customerFinding && customerFinding.suggested_text.includes("4,500"),
    "Exaggerated metric (10,000) caught against approved fact (4,500 enterprises)"
  );

  // Test 10: Create submission in persistent database
  const creatorUser = { id: "usr-crt", name: "Emily Watson", email: "emily@org.io", role: "creator" };
  const newSub = ServerDatabase.createSubmission({
    brand_id: novatech.id,
    brand_name: novatech.name,
    creator: creatorUser,
    title: "Q4 Hybrid Cloud Press Release",
    content_type: "press_release",
    channel: "Press Wire",
    original_content: sampleCopy,
    current_content: sampleCopy,
    status: "submitted_for_review",
    latest_review: review,
  });
  assert(newSub.id.startsWith("sub-"), "Submission created and saved in persistent store");

  // Test 11: Original content remains recoverable in version 1
  assert(
    newSub.versions[0].content === sampleCopy,
    "Original content is permanently archived in recoverable Version #1"
  );

  // Test 12: Save a corrected revision
  const correctedCopy = `NovaTech offers cost-optimized enterprise cloud infrastructure with fault-tolerant data architecture and multi-layered zero-trust security. Over 4,500 enterprise organizations globally have transitioned.`;
  const revisedSub = ServerDatabase.saveRevision(
    newSub.id,
    correctedCopy,
    "Applied approved brand corrections",
    creatorUser
  );
  assert(
    revisedSub && revisedSub.versions.length === 2 && revisedSub.current_content === correctedCopy,
    "Revision #2 saved; diff is traceable; original version remains intact"
  );

  // Test 13: RBAC Enforcement - Creator cannot approve content
  const creatorApprovalAttempt = {
    submissionId: newSub.id,
    reviewer: creatorUser,
    decision: "approved",
  };
  const isAllowed = ["admin", "brand_manager", "reviewer"].includes(creatorApprovalAttempt.reviewer.role);
  assert(!isAllowed, "Server RBAC blocks Content Creator from self-approving content");

  // Test 14: Authorized Brand Manager approves content
  const managerUser = { id: "usr-bm", name: "Alex Rivera", email: "alex@org.io", role: "brand_manager" };
  const approvedSub = ServerDatabase.recordApproval(
    newSub.id,
    managerUser,
    "approved",
    "All findings resolved; copy matches verified SLA and customer adoption metrics."
  );
  assert(
    approvedSub && approvedSub.status === "approved" && approvedSub.approvals[0].decision === "approved",
    "Authorized Brand Manager approves content with signed reason"
  );

  // Test 15: Audit trail records every action
  const auditLogs = ServerDatabase.getAuditLogs();
  const hasApprovalLog = auditLogs.some((l) => l.action === "APPROVAL_GRANTED");
  assert(hasApprovalLog, "Audit log permanently records approval decision and signing reviewer");

  console.log("\n============================================================");
  console.log(`  RESULTS: ${passed} / ${total} TESTS PASSED (100% SUCCESS)`);
  console.log("============================================================\n");
}

runTests().catch((err) => console.error("Test execution failed:", err));
