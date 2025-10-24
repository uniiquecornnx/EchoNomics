import { nexusBridge } from './nexus';

class NexusService {
  private isInitialized = false;
  private isRelayActive = false;

  async initialize() {
    if (this.isInitialized) {
      console.log('Nexus service already initialized');
      return;
    }

    try {
      console.log('Initializing Nexus service...');
      
      // Start the tip relay
      await nexusBridge.startTipRelay();
      this.isRelayActive = true;
      
      // Get and log bridge status
      const status = await nexusBridge.getBridgeStatus();
      console.log('Nexus bridge status:', status);
      
      // Get available chains
      const chains = nexusBridge.getAvailableChains();
      console.log('Available chains:', chains);
      
      this.isInitialized = true;
      console.log('Nexus service initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize Nexus service:', error);
      throw error;
    }
  }

  async getStatus() {
    try {
      const status = await nexusBridge.getBridgeStatus();
      return {
        isInitialized: this.isInitialized,
        isRelayActive: this.isRelayActive,
        bridgeStatus: status,
      };
    } catch (error) {
      console.error('Failed to get Nexus status:', error);
      return {
        isInitialized: this.isInitialized,
        isRelayActive: this.isRelayActive,
        bridgeStatus: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getAvailableChains() {
    return nexusBridge.getAvailableChains();
  }

  isServiceReady() {
    return this.isInitialized && this.isRelayActive;
  }
}

// Export singleton instance
export const nexusService = new NexusService();

// Initialize service on import (for server-side)
if (typeof window === 'undefined') {
  nexusService.initialize().catch(console.error);
}
