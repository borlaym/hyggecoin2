import fs from 'fs';
import defaultConfig from '../config.sample.json';
import { MINUTE } from './config';

let config: {
  knownPeers: string[];
  updateKnownPeers: boolean;
  fetchPeers: boolean;
};
let validLocalConfig = false;
try {
  config = JSON.parse(fs.readFileSync('../config.json', 'utf-8'));
  validLocalConfig = true;
} catch (err) {
  console.error(err);
  config = defaultConfig
}

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
  serverState.peers = [...serverState.peers, peer];
  savePeers(serverState.peers);
}

export function removePeer(peer: string) {
  serverState.peers = serverState.peers.filter(p => p !== peer);
  savePeers(serverState.peers);
}

// Periodically check peer data on known peers
if (config.fetchPeers) {
  setInterval(() => {
    console.log('Fetching peer infromation')
    serverState.peers.forEach((peer) => {
      fetch(`${peer}/peers`)
        .then(r => r.json())
        .then((remotePeers: string[]) => remotePeers.filter(p => !serverState.peers.includes(p)).forEach(peer => addPeer(peer)))

    })
  }, 10 * MINUTE);
}



export default serverState;