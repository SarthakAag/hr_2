import { http, HttpResponse } from "msw";
import { AUTOMATIONS } from "./automations";
import { simulateWorkflow } from "./simulateEngine";

export const handlers = [
  http.get("/api/automations", () => {
    return HttpResponse.json(AUTOMATIONS);
  }),

  http.post("/api/simulate", async ({ request }) => {
    const body = await request.json() as { nodes: unknown[]; edges: unknown[] };
    await new Promise((r) => setTimeout(r, 600));
    const result = simulateWorkflow(
      body.nodes as Parameters<typeof simulateWorkflow>[0],
      body.edges as Parameters<typeof simulateWorkflow>[1]
    );
    return HttpResponse.json(result);
  }),
];