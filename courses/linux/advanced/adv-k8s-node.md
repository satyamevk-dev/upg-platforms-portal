# Module: Kubernetes node & container runtime (OS view)

**Track:** Advanced · **Module ID:** `adv-k8s-node`

## Overview

From the Linux node, relate **kubelet** to **containerd**/**CRI-O**, understand **CNI** data paths, reserve resources with **cgroups v2**/**systemd** slices, and debug with **crictl** and **kubelet** logs.

## Learning objectives

- Trace image pulls and runtime sockets from the host.
- Map **CNI** bridges, **iptables**/**nft** rules, and pod **DNS**.
- Configure **kube-reserved**/**system-reserved** with **cgroups v2** + **systemd**.
- Debug stuck mounts and runtime issues from the node.

---

## Lesson 1: kubelet, container runtime (containerd/CRI-O), and image pulls from the host

- **kubelet** talks **CRI** to **containerd** or **CRI-O**—**crictl** uses the same socket.
- **Image pulls** respect **registry** auth secrets—host **disk** pressure on `/var` breaks pulls silently sometimes.

## Lesson 2: CNI plugins on-node: bridges, iptables/nft rules, and DNS to pods

- **CNI** adds **veth** pairs, **bridge**, **SNAT** rules—`iptables-save`/`nft list` during incidents (read-only).
- **CoreDNS** **Service** IPs depend on **kube-proxy** mode (**iptables**/**ipvs**)—symptoms include **ClusterIP** blackholes when rules desync.

## Lesson 3: cgroups v2 + systemd slices for kube-reserved / system-reserved

- **kubelet** **cgroupDriver=systemd** aligns slices with **systemd**—set **reserved** CPU/memory to avoid **starvation**.
- Verify **MemoryHigh**/**CPUQuota** on **system.slice** vs. **kubepods**—document overrides.

## Lesson 4: Debugging from the node: crictl, journal of kubelet, and stuck mounts

- **`crictl ps`**, **`logs`**, **`inspect`** for sandbox clarity; correlate **exit codes** with **OOM** kills.
- **`journalctl -u kubelet -f`** surfaces **PLEG**, **certificate**, **cgroup** errors.
- **Stuck mounts** (`transport endpoint not connected`) may need **lazy unmount** workflows—follow vendor runbooks.

---

## Key takeaways

- **Node health** is disk, cgroup, and kubelet—not only “pods look fine.”
- **CNI/kube-proxy** drifts cause “it works on one node” ghosts.

---

## Quiz

1. **CRI** in Kubernetes refers to:  
   A) The container runtime interface kubelet uses to talk to containerd/CRI-O  
   B) A RAID level  
   C) A TLS cipher suite  

2. **crictl** is most analogous to:  
   A) Docker CLI but targeting the CRI socket directly  
   B) `fdisk`  
   C) `ansible-playbook`  

3. **kube-reserved** / **system-reserved** help:  
   A) Protect node daemons from pod resource exhaustion  
   B) Encrypt etcd automatically  
   C) Replace CNI  

4. Pod **DNS** failures on a node might involve:  
   A) CNI routing, kube-proxy rules, and CoreDNS endpoints—not only app code  
   B) Only GPU drivers  
   C) Only `/etc/motd`  

5. **`journalctl -u kubelet`** is useful for:  
   A) Streaming kubelet logs including sync and runtime errors  
   B) Formatting ext3  
   C) Managing IPMI users only  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
