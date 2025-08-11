# Zyra Blockchain

Zyra is a blockchain application that implements a consensus algorithm, manages transactions, and supports smart contracts. This project serves as a foundation for building decentralized applications.

## Features

- **Blockchain**: Implements a blockchain with support for adding blocks and managing state.
- **Consensus**: Utilizes the HotStuff consensus algorithm for achieving agreement among nodes.
- **Smart Contracts**: Supports deployment and management of smart contracts.
- **Networking**: Implements peer-to-peer networking using libp2p for message broadcasting and communication.
- **Metrics**: Collects and exposes metrics for monitoring the application.
- **Dashboard**: Provides a web-based dashboard for viewing logs and metrics in real-time.

## Getting Started

### Prerequisites

- Rust (latest stable version)
- Cargo (comes with Rust)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd zyra
   ```

2. Build the project:
   ```
   cargo build
   ```

3. Run the application:
   ```
   cargo run
   