import socket
import json

BOOTSTRAP_NODES = ["node1.zyra.net:30303", "node2.zyra.net:30303"]

def discover_peers():
    """Connects to bootstrap nodes and requests peer lists using a simple protocol."""
    discovered = set()
    for node in BOOTSTRAP_NODES:
        host, port = node.split(":")
        try:
            with socket.create_connection((host, int(port)), timeout=2) as s:
                # Example protocol: send a JSON request for peers
                request = json.dumps({"action": "get_peers"}).encode()
                s.sendall(request)
                response = s.recv(4096)
                # Assume response is a JSON list of peer addresses
                peers = json.loads(response.decode())
                for peer in peers:
                    discovered.add(peer)
                print(f"Received peers from {node}: {peers}")
        except Exception as e:
            print(f"Failed to connect to {node}: {e}")
    return discovered

if __name__ == "__main__":
    peers = discover_peers()
    print("Discovered peers:", peers)