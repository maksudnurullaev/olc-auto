<template>
  <pre>
Current User:
 globals.user.id: {{ globals.user.id }}
 globals.user.role: {{ globals.user.role }}

User's current roles:
 globals.roleAsRegistered: {{ globals.roleAsRegistered }}
 globals.roleAs1c: {{ globals.roleAs1c }}
 globals.roleAsKpp: {{ globals.roleAsKpp }}
 globals.roleAsAdmin: {{ globals.roleAsAdmin }}
  </pre>
</template>

<script setup >
import { useGlobalStore } from '../../stores/globals';
const globals = useGlobalStore();
</script>
