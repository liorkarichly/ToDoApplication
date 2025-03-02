import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = new BehaviorSubject<boolean>(false);

  constructor() {
    this.connect();
  }

  /**
   * Connect to WebSocket server.
   */
  private connect() {
    if (this.socket && this.socket.connected) {
      console.warn("🔹 WebSocket already connected");
      return;
    }

    this.socket = io(`${environment.WS_URL}`, {
      transports: ['websocket'],
      reconnection: true, // Auto-reconnect
      reconnectionAttempts: 10, // Try reconnecting 10 times
      reconnectionDelay: 3000, // Wait 3s before retrying
    });

    this.socket.on('connect', () => {
      console.log("✅ WebSocket Connected:", this.socket?.id);
      this.isConnected.next(true);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn("❌ WebSocket Disconnected:", reason);
      this.isConnected.next(false);
      this.reconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error("⚠️ WebSocket Connection Error:", error);
    });

    this.socket.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 Reconnect attempt #${attempt}`);
    });

    this.socket.on('reconnect_failed', () => {
      console.error("🚨 WebSocket failed to reconnect after attempts");
    });
  }

  /**
   * Force reconnect if disconnected.
   */
  private reconnect() {
    if (this.socket) {
      console.log("🔄 Attempting Reconnect...");
      setTimeout(() => {
        this.connect();
      }, 3000);
    }
  }

/**
   * Listen for WebSocket events.
   */
listen<T>(eventName: string): Observable<T> {
  return new Observable<T>((observer) => {
    this.socket?.on(eventName, (data: T) => {
      observer.next(data);
    });

    // Cleanup when unsubscribed
    return () => {
      this.socket?.off(eventName);
    };
  });
}

  /**
   * Emit WebSocket events.
   */
  emit(eventName: string, data: any) {
    this.socket?.emit(eventName, data);
  }

  /**
   * Disconnect WebSocket.
   */
  disconnect() {
    this.socket?.disconnect();
  }
}
