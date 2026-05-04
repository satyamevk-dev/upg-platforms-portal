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

## Lesson 5: Lab—`podman inspect`, `skopeo`, seccomp default profile

- **`podman inspect`** an image—note **User**, **Cmd**, **Healthcheck**; compare to runtime **`podman inspect`** on container.
- **`skopeo inspect docker://registry/repo:tag`** without pull—review **digest** and **labels** in CI.
- Dump **default seccomp** path from engine docs—diff your **custom JSON** against it in Git.

## Lesson 6: Anti-patterns in container ops

- **`--privileged`** as default for app containers—negates most hardening.
- **Root in image + same UID on host volumes**—UID mapping surprises and data leaks.
- **Pinning `:latest` in prod**—unreproducible incidents.

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

6. **`podman inspect`** (or Docker equivalent) is most useful for verifying:  
   A) Effective runtime configuration like user, caps, mounts, and command  
   B) Kernel compile flags only  
   C) BIOS passwords  

7. Running containers with **`--privileged`** routinely is poor practice because it:  
   A) Greatly weakens isolation by granting broad host-like capabilities  
   B) Always improves performance  
   C) Is required for read-only rootfs  

8. Using the floating tag **`latest`** for production deploy artifacts tends to:  
   A) Reduce reproducibility and complicate rollbacks  
   B) Guarantee immutable digests  
   C) Disable cgroups  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A** · 6. **A** · 7. **A** · 8. **A**
