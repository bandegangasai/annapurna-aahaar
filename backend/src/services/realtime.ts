import { Response } from 'express';
import { EventEmitter } from 'events';

class RealtimeEventService extends EventEmitter {
  private clients: Set<Response> = new Set();

  constructor() {
    super();
    // Heartbeat to keep connections alive through proxies and firewalls
    setInterval(() => {
      this.sendHeartbeat();
    }, 20000);
  }

  public registerClient(res: Response): void {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders?.();

    // Send initial connection event
    res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

    this.clients.add(res);

    res.on('close', () => {
      this.clients.delete(res);
    });
  }

  public broadcast(type: string, payload: any): void {
    const message = `data: ${JSON.stringify({ type, data: payload, timestamp: new Date().toISOString() })}\n\n`;
    for (const client of this.clients) {
      try {
        client.write(message);
      } catch {
        this.clients.delete(client);
      }
    }
  }

  private sendHeartbeat(): void {
    for (const client of this.clients) {
      try {
        client.write(': keepalive\n\n');
      } catch {
        this.clients.delete(client);
      }
    }
  }

  public getConnectedClientsCount(): number {
    return this.clients.size;
  }
}

export const realtimeService = new RealtimeEventService();
