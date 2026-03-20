import { Post } from './types';

export const posts: Post[] = [
  {
    id: 'bypassing-ring-0-shadows',
    title: 'BYPASSING_RING_0_SHADOWS',
    date: '2024.05.12',
    author: 'ROOT_USER',
    readTime: '08:00 MINS',
    excerpt: 'A deep dive into bypassing modern hypervisor protections via speculative execution side-channels.',
    tags: ['SECURITY', 'PEN_TEST', 'KERNEL_MODE'],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070',
    content: `
Modern CPU architectures implement various protection layers, commonly referred to as **Privilege Rings**. While Ring 0 is historically the highest privilege level for the operating system kernel, the introduction of hypervisors has effectively created a "Ring -1".

## 01. THE_VULNERABILITY

The vulnerability stems from an inconsistency in how the \`VMENTRY\` transition handles deferred page faults during speculative execution cycles. By carefully timing the TLB (Translation Lookaside Buffer) flush, we can infer contents of host memory from the guest VM.

\`\`\`c
#include <hyper_api.h>

// Initialize speculative window
void leak_host_memory(uint64_t addr) {
    register uint64_t x;
    asm volatile (
        "mfence\\n\\t"
        "clflush (%0)\\n\\t"
        "vmentry\\n\\t"
        : : "r"(addr) : "memory"
    );
}
\`\`\`

Executing the above sequence requires precise synchronization with the system clock. We use the **RDTSC** instruction to measure timing differences in cycles, identifying cache hits vs misses.

> "Always ensure that your target system is isolated. Exploiting Ring 0 transitions can lead to permanent hardware stalls or filesystem corruption."

Patch KB-882199 addresses this by enforcing strict page attribute table (PAT) verification before context switching.
    `
  },
  {
    id: 'neural-bridge-telemetry',
    title: 'NEURAL_BRIDGE_TELEMETRY',
    date: '2024.05.10',
    author: 'ROOT_USER',
    readTime: '05:00 MINS',
    excerpt: 'Interfacing with IoT hardware via mental telemetry and low-latency neural links.',
    tags: ['NEURAL', 'IOT', 'HARDWARE'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2070',
    content: `
The Neural Bridge project aims to bridge the gap between human thought and machine action. By utilizing high-density EEG sensors and a custom signal processing pipeline, we can achieve sub-50ms latency for basic control commands.

### Signal Processing Pipeline

1. **Acquisition**: Raw EEG data is sampled at 2kHz.
2. **Filtering**: Band-pass filter (0.5Hz - 50Hz) to remove noise.
3. **Feature Extraction**: FFT-based power spectral density analysis.
4. **Classification**: Real-time inference using a lightweight CNN.

The results have been promising, with a 94% accuracy rate for binary intent classification.
    `
  }
];
