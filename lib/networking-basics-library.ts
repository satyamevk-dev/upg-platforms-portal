import type { LinuxTopic } from "./linux-topic";

export const networkingBasicsLibrary: LinuxTopic[] = [
  {
    id: "netb-osi",
    major: "Networking foundations & models",
    minors: [
      "OSI vs. TCP/IP models and where common protocols fit",
      "Frames, packets, segments; MTU and MSS basics",
      "Unicast, broadcast, multicast basics",
      "LAN, WAN, and internet edge concepts",
    ],
  },
  {
    id: "netb-ipv4",
    major: "IPv4 addressing & subnetting",
    minors: [
      "CIDR notation, subnet masks, and address classes",
      "Network/broadcast/host ranges and usable host calculations",
      "Private vs. public IPv4 ranges and RFC1918",
      "Gateway concepts and default route",
    ],
  },
  {
    id: "netb-switching",
    major: "Ethernet switching basics",
    minors: [
      "MAC addresses and switch forwarding tables",
      "VLAN tagging (802.1Q) and access vs. trunk ports",
      "Basic STP purpose and loop avoidance",
      "Speed/duplex mismatches and symptom patterns",
    ],
  },
  {
    id: "netb-routing",
    major: "Routing basics",
    minors: [
      "Static routes and route lookup order",
      "Connected routes vs. learned routes",
      "Inter-VLAN routing concepts",
      "First-hop redundancy overview (HSRP/VRRP awareness)",
    ],
  },
  {
    id: "netb-dnsdhcp",
    major: "DNS & DHCP essentials",
    minors: [
      "DNS records (A, AAAA, CNAME, MX, PTR)",
      "Name resolution flow and cache behavior",
      "DHCP DORA process and lease lifecycle",
      "IP reservations and scope planning",
    ],
  },
  {
    id: "netb-tools",
    major: "Troubleshooting tools (entry)",
    minors: [
      "ping, traceroute, nslookup/dig practical usage",
      "ipconfig/ifconfig/ip a comparisons",
      "arp table checks and neighbor discovery",
      "Reading interface counters for quick diagnostics",
    ],
  },
];
