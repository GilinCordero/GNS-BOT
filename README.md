# GNS-BOT
## Meet Sofía
---
**GNS-BOT** is a customer support **AI powered widget** for an internet provider's (GNS) CRM. Ready for deployment in the company's server, it embeds into the CRM with a single HTML tag and lets customers troubleshoot connectivity issues and manage support tickets without having to call a human agent. It acts as an intermediary between the user and GNS's API to create, manage and update tickets to speed-up network's fixing processes.

**"Sofía"** will be GNS's clients personal agent, powered by Google's Gemini API, and handles the following tasks: 

 + Opening and saving sessions in cache.
 + Authenticate users to begin their support process.
 + Diagnose network problems by walking the customer through step-by-step troubleshooting before escalating to a technician.
 + Open support tickets automatically, writing a detailed, technnical description of the reported issue and the attempted fixing protocols.
 + Look up existing tickets so the customer can check status of previous reports and complement their tickets with comments.
 + Inform about pending balance if the service has been suspended due to an outstanding payment.

The system is ready to run on a server alongside the CRM, but it's also prepared to be split across separate servers if needed — CORS is fully configurable via a single environment variable, requiring no code changes. It also ships with a ready-to-use nginx.conf for reverse proxying if the company uses Nginx.

#### Developer: Gilberto Alejandro Cordero Nuñez
#### Contact: cordero.dev@outlook.com
