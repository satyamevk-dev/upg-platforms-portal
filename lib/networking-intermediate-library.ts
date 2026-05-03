import type { LinuxTopic } from "./linux-topic";

export const networkingIntermediateLibrary: LinuxTopic[] = [
  {
    id: "neti-ospf",
    major: "Dynamic routing protocols",
    minors: [
      "OSPF areas, LSAs, and adjacency states",
      "EIGRP concepts (where applicable) and path metrics",
      "Route redistribution fundamentals and caveats",
      "Convergence behavior and failover expectations",
    ],
  },
  {
    id: "neti-bgp",
    major: "BGP fundamentals",
    minors: [
      "iBGP vs. eBGP and neighbor relationships",
      "Path attributes: local-pref, AS path, MED, communities",
      "Route filtering with prefix-lists and route-maps",
      "Basic peering design and resilience patterns",
    ],
  },
  {
    id: "neti-security",
    major: "Network security controls",
    minors: [
      "ACL design and top-down matching behavior",
      "Stateful firewalls and zone-based policy concepts",
      "NAT/PAT behaviors and troubleshooting translations",
      "VPN basics: IPsec phases and site-to-site concepts",
    ],
  },
  {
    id: "neti-wireless",
    major: "Wireless networking",
    minors: [
      "2.4GHz vs. 5GHz planning and channel overlap",
      "WPA2/WPA3 enterprise basics and authentication",
      "SSID to VLAN mapping and client roaming behavior",
      "RF interference sources and quick mitigation",
    ],
  },
  {
    id: "neti-qos",
    major: "QoS and traffic management",
    minors: [
      "Classification, marking (DSCP), queuing, and shaping",
      "Policy-map and class-map concepts",
      "Voice/video prioritization basics",
      "Congestion signals and packet drop analysis",
    ],
  },
  {
    id: "neti-monitor",
    major: "Monitoring & telemetry",
    minors: [
      "SNMP polling/traps and common OIDs",
      "Syslog levels and centralized logging patterns",
      "NetFlow/sFlow/IPFIX for traffic visibility",
      "Baseline dashboards and alert thresholds",
    ],
  },
];
