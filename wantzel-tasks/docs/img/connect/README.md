# Screenshots of connecting a client

These are the only images here that are **not** produced by the screenshot tooling: they
show a third-party client (Claude Desktop) connecting to this server, and there is no way
to drive that from a script.

They are taken by hand and dropped in. Expected files:

| file | what it shows |
|---|---|
| `01-add-connector.png` | the Add custom connector dialog, with the tunnel URL and `/mcp` |
| `02-connecting.png` | the client's "Connecting to …" toast, mid-handshake |
| `03-connected.png` | the connector listed as connected, with the tool count |
| `04-chat.png` | a real exchange: two questions, two tool calls, live answers |
| `05-ask.png` | the one sentence that creates a ticket |
| `06-calls.png` | the client's trace: list, then create |
| `07-result.png` | what the agent reported back, with the id it got |
| `08-payload.png` | the raw create_ticket request as the client shows it |

## Before adding one

Check it for anything that should not go public: an account name, an email address, a
workspace name, a browser tab or bookmark bar, other connectors, a file path. Crop to the
dialog rather than the whole screen. A tunnel URL is safe to show -- it is dead the moment
the tunnel closes.
