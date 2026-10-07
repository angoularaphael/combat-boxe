#!/usr/bin/env node
/**
 * Point d'entrée historique. La production passe par l'agent autonome.
 */
import { runProductionAgent } from './agent-production.mjs';

runProductionAgent().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
