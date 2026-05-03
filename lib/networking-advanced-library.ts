import type { LinuxTopic } from "./linux-topic";

export const networkingAdvancedLibrary: LinuxTopic[] = [
  {
    id: "neta-design",
    major: "Enterprise architecture & high availability",
    minors: [
      "Spine-leaf vs. three-tier campus designs",
      "EVPN/VXLAN fabric concepts and control/data plane separation",
      "HA design: dual-homing, MLAG/vPC, and failure domains",
      "Capacity planning with growth and redundancy assumptions",
    ],
  },
  {
    id: "neta-mpls",
    major: "MPLS & traffic engineering",
    minors: [
      "LDP, RSVP-TE, label switching basics",
      "L3VPN concepts and route targets/route distinguishers",
      "Segment routing awareness and migration patterns",
      "Provider edge troubleshooting paths",
    ],
  },
  {
    id: "neta-ddos",
    major: "Threat mitigation & edge defense",
    minors: [
      "DDoS detection and scrubbing workflows",
      "RTBH and Flowspec high-level usage",
      "WAF/CDN interplay with network-layer controls",
      "Incident runbooks and communication timing",
    ],
  },
  {
    id: "neta-automation",
    major: "Network automation at scale",
    minors: [
      "Source-of-truth and intent-based models",
      "Ansible/Nornir/Netmiko playbook patterns",
      "NAPALM/RESTCONF/NETCONF/gNMI usage models",
      "Pre/post checks and automated rollback strategies",
    ],
  },
  {
    id: "neta-sdn",
    major: "SDN & cloud networking",
    minors: [
      "Controller-based networking and policy abstractions",
      "Cloud VPC/VNet peering, transit gateways, and hybrid links",
      "Service mesh interaction with east-west traffic",
      "Multi-cloud routing and security boundary design",
    ],
  },
  {
    id: "neta-deepdebug",
    major: "Deep packet and protocol analysis",
    minors: [
      "Advanced tcpdump/Wireshark filtering and stream reconstruction",
      "TLS handshake analysis and certificate path debugging",
      "Asymmetric routing and PMTU black-hole diagnosis",
      "Control-plane policing impacts on routing stability",
    ],
  },
];
