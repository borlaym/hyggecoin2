import fs from 'fs';
import localConfig from '../config.json';
import { PORT, PORT_HEADER_NAME, SECOND } from './config';
import fetch from 'node-fetch';

const config: {
  knownPeers: string[];
  updateKnownPeers: boolean;
  fetchPeers: boolean;
} = localConfig as any;

console.log(config);

type ServerState = {
  peers: string[]
}

/**
 * Save peers data to the disc into the local config.json file
 */
function savePeers(peers: string[]) {
  if (!config.updateKnownPeers) {
    return;
  }
  fs.writeFile('../config.json', JSON.stringify({
    ...config,
    knownPeers: peers
  }), (err) => {
    if (err) {
      console.error('failed to update config.json with new peer data: ', err);
    } else {
      console.log('updated config.json with new peer data')
    }
  })
}

const serverState: ServerState = {
  peers: config.knownPeers as string[]
};

export function addPeer(peer: string) {
  if (!serverState.peers.includes(peer)) {
    console.log(`Adding ${peer} to peer list`)
    serverState.peers = [...serverState.peers, peer];
    savePeers(serverState.peers);
  }
}

export function removePeer(peer: string) {
  console.log(`Removing ${peer} from peer list`)
  serverState.peers = serverState.peers.filter(p => p !== peer);
  savePeers(serverState.peers);
}

// Periodically check peer data on known peers
if (config.fetchPeers) {
  setInterval(() => {
    console.log('Fetching peer infromation')
    serverState.peers.forEach((peer) => {
      fetch(`${peer}/peers`, {
        headers: {
          [PORT_HEADER_NAME] : String(PORT)
        }
      })
        .then(r => r.json())
        .then((remotePeers: string[]) => {
          remotePeers.filter(p => !serverState.peers.includes(p)).forEach(peer => addPeer(peer))
        })
        .catch(err => {
          removePeer(peer);
        })

    })
  }, 5 * SECOND);
}



export default serverState;