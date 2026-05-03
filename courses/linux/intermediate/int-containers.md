# Module: Containers & workload isolation

**Track:** Intermediate · **Module ID:** `int-containers`

## Overview

Ground container behavior in **namespaces** and **cgroups**, operate **Podman**/**Docker** including rootless modes, and understand storage, networking, **seccomp**, and **capabilities**—plus when **systemd-nspawn** or Compose fit.

## Learning objectives

- Explain **namespaces** vs. **cgroups** and containers vs. VMs.
- Pull, run, and build images with **Podman**/**Docker**; use **rootless** where policy allows.
- Compare storage/network modes and introductory **seccomp**/capability tuning.
- Choose among **nspawn**, Compose, and full orchestrators pragmatically.

---

## Lesson 1: Namespaces and cgroups as foundation; containers vs. VMs

- **Namespaces** isolate PID, mount, network, IPC, UTS, user views; **cgroups** cap and account resources.
- **Containers** share the host kernel—fast, dense; **VMs** isolate with a hypervisor—stronger boundary, more overhead.

## Lesson 2: Podman and Docker: images, registries, run, build; rootless containers

- **`pull`**, **`run`**, **`build`** workflows; **registries** need trust (signing, mirroring).
- **Rootless** maps user namespaces—fewer host risks; know volume UID mapping and privileged port limits.

## Lesson 3: Storage and networking modes; seccomp and capabilities (intro)

- **Graph drivers** / **overlay** storage; **volumes** vs. bind mounts—backup and SELinux labels matter.
- **Network:** bridge/NAT vs. host networking—security and port collision trade-offs.
- **seccomp** profiles and **capabilities** (`--cap-drop=all`, add minimal caps) shrink attack surface.

## Lesson 4: systemd-nspawn / compose files — when teams pick each tool

- **systemd-nspawn** lightweight systemd-integrated machines—great for pet system chroots.
- **Compose** files standardize multi-service dev stacks; **Kubernetes** when scheduling dominates.

---

## Key takeaways

- **Containers are not security boundaries by default**—layer seccomp, caps, MAC, signing.
- **Rootless** reduces blast radius but changes operational assumptions (ports, volumes).

---

## Quiz

1. **cgroups** primarily provide:  
   A) Resource limits and accounting for groups of processes  
   B) DNS resolution  
   C) Filesystem encryption keys  

2. Compared to VMs, **containers** on Linux:  
   A) Share the host kernel and isolate primarily via namespaces + cgroups  
   B) Always include a full hardware-emulated NIC  
   C) Cannot use overlay storage  

3. **Rootless** containers generally:  
   A) Run without requiring root on the host, with some feature trade-offs  
   B) Require disabling the kernel  
   C) Imply no user namespaces  

4. **seccomp** profiles affect:  
   A) Which syscalls a process may invoke  
   B) Only CPU frequency scaling  
   C) Only RAID levels  

5. **Linux capabilities** are:  
   A) Fine-grained privileges that can be granted instead of full root  
   B) A type of disk label only  
   C) SSH key types only  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
