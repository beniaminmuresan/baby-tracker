<script setup>
  import { reactive } from 'vue';
  import Button from 'primevue/button';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';

  const trackingData = reactive(JSON.parse(localStorage.getItem('trackingData')) || []);
  const markPoo = () => {
    trackingData.push({ trackingType: 'poo', timestamp: Date.now() });
    localStorage.setItem('trackingData', JSON.stringify(trackingData));
  }
  const markPee = () => {
    trackingData.push({ trackingType: 'pee', timestamp: Date.now() });
    localStorage.setItem('trackingData', JSON.stringify(trackingData));
  }
  const markStartFeeding = () => {
    trackingData.push({ trackingType: 'feeding', timestamp: Date.now(), end_timestamp: null });
    localStorage.setItem('trackingData', JSON.stringify(trackingData));
  }
</script>

<template>
  <Button label="Poo" @click="markPoo" />
  <Button label="Pee" @click="markPee" />
  <Button label="Eat" @click="markStartFeeding" />
  <br>
  <DataTable :value="trackingData">
    <Column field="trackingType" header="Tip"></Column>
    <Column field="timestamp" header="Data"></Column>
  </DataTable>
</template>
