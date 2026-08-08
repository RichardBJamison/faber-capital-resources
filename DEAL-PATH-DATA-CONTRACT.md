# DEAL-PATH-DATA-CONTRACT

**Version:** `recr.deal_path.v1`  
**Stage:** 11  
**Purpose:** Provider-neutral payload for future GHL / CRM mapping.  
**Live submission in Stage 11:** none. Ephemeral in-page state only.

## Endpoint (future)

Not wired. Production will map this JSON to a GHL form or webhook. Do not invent credentials.

## Payload shape

```json
{
  "schema": "recr.deal_path.v1",
  "generatedAt": "ISO-8601",
  "sourcePage": "/tools/deal-path/",
  "occupancy": "investment|owner_occupied",
  "units": "1|2|3|4|5plus",
  "propertyForm": "existing|ground_up",
  "transaction": "purchasing|owned|evaluating",
  "condition": "ready_rent|needs_light_rehab|needs_major_rehab|ground_up",
  "capitalNeed": "purchase|rehab|purchase_and_rehab|refinance|bridge_timing|unknown",
  "strategy": "renovate_sell|buy_rehab_hold|hold_stabilized|build_sell|build_hold|temporary_bridge|not_sure",
  "timingConstraint": "yes|no|unknown",
  "estimates": {
    "purchasePrice": null,
    "rehabBudget": null,
    "arv": null,
    "monthlyRent": null,
    "notes": ""
  },
  "market": "cleveland|south_florida|other|unknown",
  "guidance": {
    "outcome": "path|oos|needs_conversation",
    "primaryPath": "fix-and-flip|rental|bridge|ground-up|multifamily|purchase-rehab|null",
    "secondaryPath": "string|null",
    "multifamilyContext": true,
    "reasons": ["..."],
    "readinessMissing": ["..."],
    "resourceLinks": [{"label":"","href":""}]
  },
  "contact": {
    "name": null,
    "email": null,
    "phone": null
  }
}
```

## Field rules

- Contact fields optional in the wizard; required only if user chooses “Share with RECR” (still mock-local until CRM live).  
- Never collect SSN, bank accounts, cards, tax returns, government IDs.  
- Numbers are estimates; store as strings or numbers without implying underwriting.  
- `guidance` is derived client-side; CRM should treat it as advisory text, not eligibility.

## Forbidden in payload interpretation

Do not map guidance to “approved,” rates, LTV floors, FICO, or lender auto-assignment without human review.
