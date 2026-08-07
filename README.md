# @apex/verify

APEX PSI SDK — Cryptographic verification for JavaScript/TypeScript.

## Installation

```bash
npm install @apex/verify
```

## Quick Start

```typescript
import { seal, verify } from "@apex/verify";

// Seal content
const receipt = await seal("Important document", { author: "Alice" });
console.log(receipt.hash);

// Verify receipt
const result = await verify(receipt);
console.log(result.valid); // true
```

## API

### Class-based usage

```typescript
import { ApexPSI } from "@apex/verify";

const client = new ApexPSI({
  apiBase: "https://sovereign-ai.services/api",
  apiKey: "your-api-key", // optional
});

// Seal
const receipt = await client.seal({
  content: "Document content",
  metadata: { author: "Alice" },
});

// Verify
const result = await client.verify(receipt);

// Anchor to Bitcoin
const anchor = await client.anchor(receipt);

// Generate citation
const citation = await client.cite(receipt, "apa");

// Audit chain
const report = await client.audit([receipt1, receipt2], true);
```

### Convenience functions

```typescript
import { seal, verify, anchor, cite, audit } from "@apex/verify";

const receipt = await seal("content", { metadata });
const result = await verify(receipt);
const anchor = await anchor(receipt);
const citation = await cite(receipt, "apa");
const report = await audit([receipt1, receipt2]);
```

## Configuration

```typescript
const client = new ApexPSI({
  apiBase: "https://sovereign-ai.services/api", // default
  apiKey: "your-api-key", // optional
});
```

## Links

- **Website:** https://sovereign-ai.services
- **Documentation:** https://sovereign-ai.services/mcp
- **MCP Server:** @apex/psi-mcp-server
- **GitHub:** https://github.com/apex-psi/sdk

## License

MIT
